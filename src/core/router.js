import { authGuard, roleGuard } from "./guards.js";
import { bindNavbarEvents, navbar } from "../shared/navbar.js";
import { renderDashboard } from "../modules/dashboard/dashboard.js";
import { ROLES } from "../modules/auth/auth.constants.js";
import { bindLoginForm, renderLoginForm } from "../modules/auth/login-form.js";
import { bindProjectForm, renderProjectForm } from "../modules/projects/project-form.js";
import { bindProjectListEvents, renderProjectList } from "../modules/projects/project-list.js";
import { escapeHtml } from "../shared/dom.js";
import { toast } from "../shared/toast.js";

export function initRouter() {
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}

export function navigate(path) {
  location.hash = path;
}

export async function renderRoute() {
  try {
    await resolveRoute();
  } catch (error) {
    document.querySelector("#app").innerHTML = `
      ${navbar()}
      <main class="mx-auto max-w-3xl px-4 py-8">
        <section class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 class="text-2xl font-bold text-slate-900">Something went wrong</h1>
          <p class="mt-2 text-slate-600">${escapeHtml(error.message)}</p>
          <a class="mt-4 inline-block rounded-md bg-primary px-4 py-2 font-medium text-white" href="#/dashboard">Go to dashboard</a>
        </section>
      </main>
    `;
    bindNavbarEvents();
    toast(error.message, "danger");
  }
}

async function resolveRoute() {
  const path = getPath();

  if (path === "/") {
    navigate(authGuard() ? "/dashboard" : "/login");
    return;
  }

  if (path === "/login") {
    if (authGuard()) {
      navigate("/dashboard");
      return;
    }

    document.querySelector("#app").innerHTML = renderLoginForm();
    bindLoginForm();
    return;
  }

  if (!authGuard()) {
    navigate("/login");
    return;
  }

  if (path === "/dashboard") {
    await renderProtectedView(await renderDashboard());
    return;
  }

  if (path === "/projects") {
    await renderProtectedView(await renderProjectList());
    bindProjectListEvents();
    return;
  }

  if (path === "/projects/new") {
    if (!roleGuard([ROLES.MANAGER])) {
      navigate("/projects");
      return;
    }

    await renderProtectedView(await renderProjectForm());
    bindProjectForm();
    return;
  }

  if (path.startsWith("/projects/edit/")) {
    if (!roleGuard([ROLES.MANAGER])) {
      navigate("/projects");
      return;
    }

    const id = path.split("/").at(-1);
    const decodedId = decodeURIComponent(id);
    await renderProtectedView(await renderProjectForm(decodedId));
    bindProjectForm(decodedId);
    return;
  }

  navigate("/dashboard");
}

async function renderProtectedView(html) {
  document.querySelector("#app").innerHTML = `
    ${navbar()}
    <main id="view">${html}</main>
  `;
  bindNavbarEvents();
}

function getPath() {
  return location.hash.replace("#", "") || "/";
}
