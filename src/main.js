import "./style.css";
import { initRouter, navigate } from "./core/router.js";
import { getCurrentUser } from "./modules/auth/auth.service.js";
import { initTheme } from "./shared/theme.js";

initTheme();
getCurrentUser();
initRouter();

if (!location.hash) {
  navigate("/login");
}

