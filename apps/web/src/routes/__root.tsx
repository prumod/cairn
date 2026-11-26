import { HeadContent, createRootRoute, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppLayout } from "../AppLayout.js";
import { themeInitScript } from "../shared/theme/theme.js";
import "@ui-sdk/core/web.css";
import "../style.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cairn | Perfil da empresa" },
    ],
  }),
  component: AppLayout,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT">
      <head>
        {/* First in <head>, so data-theme is set before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
