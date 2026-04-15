import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LoginScreen } from "./components/LoginScreen";
import { loadStore } from "./lib/store";
import { exchangeCode, getSession, isGuest, redirectToGitHub, redirectToGoogle, enterGuestMode } from "./lib/auth";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

async function bootstrap() {
  // Handle GitHub OAuth callback (?code=... in URL)
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const provider = params.get("state") ?? "github";
  if (code) {
    window.history.replaceState({}, "", window.location.pathname);
    try {
      await exchangeCode(code, provider);
    } catch {
      // Auth failed — will show login screen
    }
  }

  const session = getSession();
  const guest = isGuest();

  if (session) {
    await loadStore();
  }

  if (session || guest) {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    createRoot(root).render(
      <StrictMode>
        <LoginScreen onGitHub={redirectToGitHub} onGoogle={redirectToGoogle} onGuest={() => { enterGuestMode(); window.location.reload(); }} />
      </StrictMode>
    );
  }
}

bootstrap();
