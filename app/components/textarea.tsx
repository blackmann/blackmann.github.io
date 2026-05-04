import clsx from "clsx";
import React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <div>
        <textarea
          ref={ref}
          className={clsx(
            "block w-full rounded-lg bg-zinc-200 border-zinc-300 dark:border-neutral-700 dark:bg-neutral-800 px-2 py-0.5 disabled:opacity-60",
            className,
          )}
          {...props}
        />

        {props.maxLength && (
          <div className="text-xs text-secondary">
            {props.value?.toString().length || 0} / {props.maxLength}
          </div>
        )}
      </div>
    );
  },
);
