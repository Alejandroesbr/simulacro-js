import "./style.css";
import { initRouter, navigate } from "./core/router.js";
import { getCurrentUser } from "./modules/auth/auth.service.js";

getCurrentUser();
initRouter();

if (!location.hash) {
  navigate("/login");
}

