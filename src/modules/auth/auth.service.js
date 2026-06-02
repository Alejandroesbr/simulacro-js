import { get } from "../../api/api.js";
import { setUser } from "../../core/store.js";
import { ROLES } from "./auth.constants.js";
import { clearSession, getSession, saveSession } from "./auth.store.js";

export async function login(email, password) {
  const users = await get("/users");
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password
  );

  if (!user || !Object.values(ROLES).includes(user.role)) {
    throw new Error("Invalid email or password");
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  setUser(sessionUser);
  saveSession(sessionUser);

  return sessionUser;
}

export function logout() {
  setUser(null);
  clearSession();
}

export function getCurrentUser() {
  const user = getSession();
  setUser(user);
  return user;
}
