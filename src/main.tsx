import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Clear old/corrupted localStorage on first load to ensure clean state
// This runs before any React code
if (!localStorage.getItem("telcoflow_initialized_v2")) {
  console.log("First time initialization, clearing old data");
  localStorage.removeItem("telcoflow_saved");
  localStorage.setItem("telcoflow_initialized_v2", "true");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
