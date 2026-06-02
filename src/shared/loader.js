let loaderElement = null;

export function showLoader(message = "Loading...") {
  if (loaderElement) return;

  loaderElement = document.createElement("div");
  loaderElement.className =
    "fixed inset-0 z-50 grid place-items-center bg-slate-950/40";
  loaderElement.innerHTML = `
    <div class="rounded-lg bg-white px-6 py-4 text-center shadow-lg">
      <div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
      <p class="text-sm font-medium text-slate-700">${message}</p>
    </div>
  `;

  document.body.appendChild(loaderElement);
}

export function hideLoader() {
  loaderElement?.remove();
  loaderElement = null;
}

