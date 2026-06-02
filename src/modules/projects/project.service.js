import { get, patch, post, remove } from "../../api/api.js";

export function getAll() {
  return get("/projects");
}

export function getById(id) {
  return get(`/projects/${id}`);
}

export function create(project) {
  return post("/projects", project);
}

export function update(id, project) {
  return patch(`/projects/${id}`, project);
}

export function deleteProject(id) {
  return remove(`/projects/${id}`);
}
