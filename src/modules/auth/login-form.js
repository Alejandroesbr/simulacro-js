import { navigate } from "../../core/router.js";
import { hideLoader, showLoader } from "../../shared/loader.js";
import { toast } from "../../shared/toast.js";
import { email, maxLength, minLength, required } from "../../shared/validators.js";
import { qs } from "../../shared/dom.js";
import { login } from "./auth.service.js";

export function renderLoginForm() {
  return `
    <main class="grid min-h-screen place-items-center px-4">
      <section class="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="mb-1 text-2xl font-bold text-slate-900">Login</h1>
        <p class="mb-6 text-sm text-slate-500">Enter with one of the seeded users.</p>

        <form id="login-form" class="space-y-4">
          <label class="block" for="email">
            <span class="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input
              id="email"
              class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-primary"
              type="email"
              autocomplete="email"
            />
            <small id="email-error" class="mt-1 block text-danger"></small>
          </label>

          <label class="block" for="password">
            <span class="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <input
              id="password"
              class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-primary"
              type="password"
              autocomplete="current-password"
            />
            <small id="password-error" class="mt-1 block text-danger"></small>
          </label>

          <button class="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover">
            Sign in
          </button>
        </form>
      </section>
    </main>
  `;
}

export function bindLoginForm() {
  qs("#login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = qs("#email");
    const passwordInput = qs("#password");
    const emailError =
      required("Email is required")(emailInput.value) ||
      email("Email format is invalid")(emailInput.value) ||
      maxLength(80, "Email must have 80 characters or less")(emailInput.value);
    const passwordError =
      required("Password is required")(passwordInput.value) ||
      minLength(6, "Password must have at least 6 characters")(passwordInput.value);

    qs("#email-error").textContent = emailError || "";
    qs("#password-error").textContent = passwordError || "";

    if (emailError || passwordError) return;

    try {
      showLoader("Signing in...");
      await login(emailInput.value.trim(), passwordInput.value);
      toast("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast(error.message, "danger");
    } finally {
      hideLoader();
    }
  });
}
