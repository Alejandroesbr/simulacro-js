import { getUser } from "../../core/store.js";
import { escapeHtml } from "../../shared/dom.js";
import { getProjectsByRole, loadProjects } from "../projects/project.store.js";

export async function renderDashboard() {
  await loadProjects();

  const user = getUser();
  const projects = getProjectsByRole(user);
  const pending = projects.filter((project) => project.status === "pending");
  const progress = projects.filter((project) => project.status === "progress");
  const done = projects.filter((project) => project.status === "done");

  return `
    <section class="mx-auto max-w-6xl px-4 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p class="text-slate-600">Welcome, ${escapeHtml(user.name)}. This is your project summary.</p>
      </div>

      <div class="grid gap-4 md:grid-cols-4">
        ${statCard("Total", projects.length, "bg-primary")}
        ${statCard("Pending", pending.length, "bg-warning")}
        ${statCard("In progress", progress.length, "bg-sky-500")}
        ${statCard("Done", done.length, "bg-success")}
      </div>
    </section>
  `;
}

function statCard(label, value, color) {
  return `
    <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-3 h-2 w-10 rounded-full ${color}"></div>
      <p class="text-sm font-medium text-slate-500">${label}</p>
      <p class="mt-2 text-3xl font-bold text-slate-900">${value}</p>
    </article>
  `;
}
