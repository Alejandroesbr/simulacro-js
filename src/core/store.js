export const store = {
  user: null,
  projects: [],
};

export function setUser(user) {
  store.user = user;
}

export function getUser() {
  return store.user;
}

export function setProjects(projects) {
  store.projects = projects;
}

export function getProjects() {
  return store.projects;
}
