import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { loadStore } from "./lib/store";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

// Load persisted data from Worker before mounting React,
// so all hooks initialize with the correct state.
loadStore().then(() => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
