import { navigate } from "../core/router.js";
import { getUser } from "../core/store.js";
import { logout } from "../modules/auth/auth.service.js";
import { escapeHtml, qs } from "./dom.js";
import { toast } from "./toast.js";
import { getThemeButtonLabel, toggleTheme } from "./theme.js";

export function navbar() {
  const user = getUser();

  if (!user) return "";

  return `
    <header class="border-b border-slate-200 bg-white">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#/dashboard" class="text-lg font-bold text-primary">Simulacro JS</a>

        <div class="flex items-center gap-4">
          <a class="text-sm font-medium text-slate-700 hover:text-primary" href="#/dashboard">Dashboard</a>
          <a class="text-sm font-medium text-slate-700 hover:text-primary" href="#/projects">Projects</a>
          <span class="text-sm text-slate-500">${escapeHtml(user.name)} (${escapeHtml(user.role)})</span>
          <button id="theme-toggle-btn" class="rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            ${getThemeButtonLabel()}
          </button>
          <button id="logout-btn" class="rounded-md bg-danger px-3 py-2 text-sm font-medium text-white">
            Logout
          </button>
        </div>
      </nav>
    </header>
  `;
}

export function bindNavbarEvents() {
  const themeButton = qs("#theme-toggle-btn");
  const logoutButton = qs("#logout-btn");

  themeButton?.addEventListener("click", () => {
    toggleTheme();
    themeButton.textContent = getThemeButtonLabel();
  });

  logoutButton?.addEventListener("click", () => {
    logout();
    toast("Session closed", "info");
    navigate("/login");
  });
}
