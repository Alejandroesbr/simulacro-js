import { getUser } from "../../core/store.js";
import { escapeHtml, qsAll } from "../../shared/dom.js";
import { toast } from "../../shared/toast.js";
import { ROLES } from "../auth/auth.constants.js";
import { STATUS_LABELS } from "./project.constants.js";
import { deleteProject } from "./project.service.js";
import { getProjectsByRole, loadProjects } from "./project.store.js";

export async function renderProjectList() {
  await loadProjects();

  const user = getUser();
  const projects = getProjectsByRole(user);
  const canManage = user.role === ROLES.MANAGER;

  return `
    <section class="mx-auto max-w-6xl px-4 py-8">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Projects</h1>
          <p class="text-slate-600">Manage and review project assignments.</p>
        </div>

        ${
          canManage
            ? `<a class="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover" href="#/projects/new">New project</a>`
            : ""
        }
      </div>

      <div class="grid gap-4">
        ${
          projects.length
            ? projects.map((project) => projectCard(project, canManage)).join("")
            : `<p class="rounded-lg border border-slate-200 bg-white p-5 text-slate-500">No projects found.</p>`
        }
      </div>
    </section>
  `;
}

export function bindProjectListEvents() {
  qsAll("[data-delete-project]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.deleteProject;
      const confirmed = confirm("Delete this project?");

      if (!confirmed) return;

      try {
        await deleteProject(id);
        button.closest("[data-project-card]")?.remove();
        toast("Project deleted", "warning");
      } catch (error) {
        toast(error.message, "danger");
      }
    });
  });
}

function projectCard(project, canManage) {
  return `
    <article data-project-card class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900">${escapeHtml(project.title)}</h2>
          <p class="mt-1 text-sm text-slate-600">${escapeHtml(project.description)}</p>
          <span class="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            ${escapeHtml(STATUS_LABELS[project.status] || project.status)}
          </span>
        </div>

        ${
          canManage
            ? `
              <div class="flex gap-2">
                <a class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700" href="#/projects/edit/${encodeURIComponent(project.id)}">Edit</a>
                <button data-delete-project="${escapeHtml(project.id)}" class="rounded-md bg-danger px-3 py-2 text-sm font-medium text-white">Delete</button>
              </div>
            `
            : ""
        }
      </div>
    </article>
  `;
}
