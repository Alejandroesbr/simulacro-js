import { getUser } from "./store.js";

export function authGuard() {
  return Boolean(getUser());
}

export function roleGuard(allowedRoles = []) {
  const user = getUser();
  return Boolean(user && allowedRoles.includes(user.role));
}
