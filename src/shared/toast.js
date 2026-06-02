export function toast(message, type = "success") {
  const colors = {
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning",
    info: "bg-primary",
  };

  const element = document.createElement("div");
  element.className = `fixed right-4 top-4 z-50 rounded-md px-4 py-3 text-sm font-medium text-white shadow-lg ${
    colors[type] || colors.info
  }`;
  element.textContent = message;

  document.body.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 3000);
}
