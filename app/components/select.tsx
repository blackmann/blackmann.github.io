import clsx from "clsx";
import React from "react";

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          "block w-full rounded-lg bg-zinc-200 border-zinc-300 dark:border-neutral-700 dark:bg-neutral-800 px-2 py-2 disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);
