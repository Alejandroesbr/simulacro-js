import { setProjects, getProjects } from "../../core/store.js";
import { ROLES } from "../auth/auth.constants.js";
import { getAll } from "./project.service.js";

export async function loadProjects() {
  const projects = await getAll();
  setProjects(projects);
  return projects;
}

export function getProjectsByRole(user) {
  const projects = getProjects();

  if (!user) return [];

  if (user.role === ROLES.MANAGER) {
    return projects;
  }

  return projects.filter((project) => String(project.assignedTo) === String(user.id));
}
