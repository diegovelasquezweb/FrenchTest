import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppLayout } from "@/src/layout/AppLayout";

export const metadata: Metadata = {
  title: "TEF — Pratiquer le français",
  description: "Entraînez-vous pour le TEF Canada",
  icons: { icon: "/favicon.svg" },
};

// Runs synchronously before first paint.
// Reads persisted theme and sets data-theme on <html> to prevent flash.
const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('tef-theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
