import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LoginScreen } from "./components/LoginScreen";
import { loadStore } from "./lib/store";
import { exchangeCode, getSession, isGuest, redirectToGitHub, redirectToGoogle, enterGuestMode, validateOAuthCallback, restoreSession } from "./lib/auth";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const root = createRoot(rootElement);

async function bootstrap() {
  const params = new URLSearchParams(window.location.search);
  const code  = params.get("code");
  const state = params.get("state") ?? "";
  if (code) {
    window.history.replaceState({}, "", "/");
    try {
      const provider = validateOAuthCallback(state);
      await exchangeCode(code, provider);
    } catch {
      // Auth failed or CSRF mismatch — show login screen
    }
  } else {
    // No OAuth callback — try to rehidrate session from httpOnly cookie
    await restoreSession();
  }

  const session = getSession();
  const guest = isGuest();

  if (session) {
    await loadStore();
  }

  if (session || guest) {
    root.render(
      <StrictMode>
        <App session={session} />
      </StrictMode>
    );
  } else {
    root.render(
      <StrictMode>
        <LoginScreen
          onGitHub={redirectToGitHub}
          onGoogle={redirectToGoogle}
          onGuest={() => { enterGuestMode(); window.location.reload(); }}
        />
      </StrictMode>
    );
  }
}

bootstrap();
