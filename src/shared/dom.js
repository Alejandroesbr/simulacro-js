// qs(), render(), createElement()

export function qs(selector) {
  return document.querySelector(selector);
}

export function render(selector, html) {
  document.querySelector(selector).innerHTML = html;
}

export function createElement(tag, text = "") {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
