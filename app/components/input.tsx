import clsx from "clsx";
import React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "block w-full rounded-lg bg-zinc-100 border-zinc-300 dark:border-neutral-700 dark:bg-neutral-800 px-2 py-0.5 disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);

export { Input };
