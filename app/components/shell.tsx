import type React from "react";
import { Navigation } from "./navigation";

export function Shell({ children }: React.PropsWithChildren) {
  return (
    <div className="h-dvh flex overflow-hidden">
      <aside className="h-full shrink-0 overflow-y-auto overscroll-contain">
        <Navigation />
      </aside>
      <main className="min-w-0 flex-1 h-full">{children}</main>
    </div>
  );
}
