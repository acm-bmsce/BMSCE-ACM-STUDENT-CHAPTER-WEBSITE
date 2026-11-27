import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/site.css";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

// After a deploy, old lazy chunks disappear; reload once to pick up the new build.
window.addEventListener("vite:preloadError", () => {
  try {
    if (sessionStorage.getItem("acm-reloaded")) return;
    sessionStorage.setItem("acm-reloaded", "1");
  } catch {
    /* storage unavailable */
  }
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
