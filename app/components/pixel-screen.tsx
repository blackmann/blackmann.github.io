import clsx from "clsx";
import type React from "react";

type PixelScreenProps = React.PropsWithChildren<{
  className?: string;
  label: string;
}>;

export function PixelScreen({ children, className, label }: PixelScreenProps) {
  return (
    <div
      aria-label={label}
      className={clsx("relative isolate h-16 bg-transparent", className)}
      role="img"
    >
      {children}
    </div>
  );
}
