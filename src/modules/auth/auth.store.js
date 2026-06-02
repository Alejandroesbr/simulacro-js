import { ROLES, SESSION_KEY } from "./auth.constants.js";

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession() {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    const user = session ? JSON.parse(session) : null;

    if (!isValidSession(user)) {
      clearSession();
      return null;
    }

    return user;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function isValidSession(user) {
  return Boolean(
    user &&
      user.id &&
      user.name &&
      user.email &&
      Object.values(ROLES).includes(user.role)
  );
}
