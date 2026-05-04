import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";
import "./styles.css";

import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { PendingUI } from "./components/pending-ui";
import { Shell } from "./components/shell";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <PendingUI />
        <Shell>{children}</Shell>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
