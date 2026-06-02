import { get } from "../../api/api.js";
import { navigate } from "../../core/router.js";
import { escapeHtml } from "../../shared/dom.js";
import { hideLoader, showLoader } from "../../shared/loader.js";
import { toast } from "../../shared/toast.js";
import { maxLength, minLength, oneOf, required } from "../../shared/validators.js";
import { STATUS, STATUS_LABELS } from "./project.constants.js";
import { create, getById, update } from "./project.service.js";

let users = [];

export async function renderProjectForm(id = null) {
  const isEdit = Boolean(id);
  const project = isEdit
    ? await getById(id)
    : {
        title: "",
        description: "",
        status: STATUS.PENDING,
        assignedTo: "",
      };

  users = await get("/users");

  return `
    <section class="mx-auto max-w-3xl px-4 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900">${isEdit ? "Edit project" : "New project"}</h1>
        <p class="text-slate-600">Use the same form for create and update mode.</p>
      </div>

      <form id="project-form" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div class="grid gap-4">
          <label class="block" for="title">
            <span class="mb-1 block text-sm font-medium text-slate-700">Title</span>
            <input id="title" class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-primary" value="${escapeHtml(project.title)}" />
            <small id="title-error" class="mt-1 block text-danger"></small>
          </label>

          <label class="block" for="description">
            <span class="mb-1 block text-sm font-medium text-slate-700">Description</span>
            <textarea id="description" class="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-primary">${escapeHtml(project.description)}</textarea>
            <small id="description-error" class="mt-1 block text-danger"></small>
          </label>

          <label class="block" for="status">
            <span class="mb-1 block text-sm font-medium text-slate-700">Status</span>
            <select id="status" class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-primary">
              ${Object.values(STATUS)
                .map(
                  (status) =>
                    `<option value="${status}" ${project.status === status ? "selected" : ""}>${escapeHtml(STATUS_LABELS[status])}</option>`
                )
                .join("")}
            </select>
            <small id="status-error" class="mt-1 block text-danger"></small>
          </label>

          <label class="block" for="assignedTo">
            <span class="mb-1 block text-sm font-medium text-slate-700">Assigned to</span>
            <select id="assignedTo" class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-primary">
              <option value="">Select a user</option>
              ${users
                .map(
                  (user) =>
                    `<option value="${escapeHtml(user.id)}" ${String(project.assignedTo) === String(user.id) ? "selected" : ""}>${escapeHtml(user.name)} (${escapeHtml(user.role)})</option>`
                )
                .join("")}
            </select>
            <small id="assignedTo-error" class="mt-1 block text-danger"></small>
          </label>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <a href="#/projects" class="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700">Cancel</a>
          <button class="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover">
            ${isEdit ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </section>
  `;
}

export function bindProjectForm(id = null) {
  document.querySelector("#project-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();
    const status = document.querySelector("#status").value;
    const assignedTo = document.querySelector("#assignedTo").value;

    const allowedUserIds = users.map((user) => String(user.id));
    const titleError =
      required("Title is required")(title) ||
      minLength(3, "Title must have at least 3 characters")(title) ||
      maxLength(80, "Title must have 80 characters or less")(title);
    const descriptionError =
      required("Description is required")(description) ||
      minLength(10, "Description must have at least 10 characters")(description) ||
      maxLength(250, "Description must have 250 characters or less")(description);
    const statusError = oneOf(Object.values(STATUS), "Status is invalid")(status);
    const assignedToError =
      required("Assigned user is required")(assignedTo) ||
      oneOf(allowedUserIds, "Assigned user does not exist")(assignedTo);

    document.querySelector("#title-error").textContent = titleError || "";
    document.querySelector("#description-error").textContent = descriptionError || "";
    document.querySelector("#status-error").textContent = statusError || "";
    document.querySelector("#assignedTo-error").textContent = assignedToError || "";

    if (titleError || descriptionError || statusError || assignedToError) return;

    const project = {
      title,
      description,
      status,
      assignedTo,
      updatedAt: new Date().toISOString(),
    };

    try {
      showLoader(id ? "Updating project..." : "Creating project...");

      if (id) {
        await update(id, project);
        toast("Project updated");
      } else {
        await create({
          ...project,
          createdAt: new Date().toISOString(),
        });
        toast("Project created");
      }

      navigate("/projects");
    } catch (error) {
      toast(error.message, "danger");
    } finally {
      hideLoader();
    }
  });
}
