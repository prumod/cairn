import { HeadContent, createRootRoute, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppLayout } from "../AppLayout.js";
import { noFlashScript } from "../shared/theme/theme.js";
import "@ui-sdk/core/web.css";
import "../style.css";

export const Route = createRootRoute({
  head: () => ({
    scripts: [{ children: noFlashScript }],
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
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
