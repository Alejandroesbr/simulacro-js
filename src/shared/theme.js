const THEME_KEY = "simulacro-theme";

export function initTheme() {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

export function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  return isDark;
}

export function getThemeButtonLabel() {
  return document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
}
