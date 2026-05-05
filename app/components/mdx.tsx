import { runSync } from "@mdx-js/mdx";
import clsx from "clsx";
import type { ComponentPropsWithoutRef, ComponentType, ElementType } from "react";
import * as devRuntime from "react/jsx-dev-runtime";
import * as runtime from "react/jsx-runtime";

function Draw(props: { aspectRatio?: number; id?: string }) {
  return (
    <figure
      className="my-6 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 dark:border-neutral-800 dark:bg-neutral-900"
      style={{ aspectRatio: props.aspectRatio }}
    >
      <div className="flex h-full min-h-48 items-center justify-center p-6 text-center text-secondary">
        <div>
          <div className="i-solar-palette-round-line-duotone mx-auto mb-3 text-3xl" />
          <figcaption className="font-medium">{props.id ?? "Drawing"}</figcaption>
        </div>
      </div>
    </figure>
  );
}

function ExternalLink(props: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      {...props}
      className="text-stone-900 underline decoration-stone-300 underline-offset-3 transition hover:decoration-stone-900 dark:text-neutral-50 dark:decoration-neutral-600 dark:hover:decoration-neutral-50"
    />
  );
}

function Code(props: ComponentPropsWithoutRef<"code">) {
  const isBlockCode = typeof props.className === "string" && props.className.includes("language-");

  if (isBlockCode) {
    return <code {...props} className={clsx(props.className, "block font-mono")} />;
  }

  return (
    <code
      {...props}
      className={clsx(
        props.className,
        "rounded bg-stone-200 px-1.5 py-0.5 font-mono text-[0.92em] dark:bg-neutral-800",
      )}
    />
  );
}

function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      {...props}
      className={clsx(
        props.className,
        "my-5 overflow-x-auto rounded-lg p-4 font-mono text-sm leading-6",
      )}
    />
  );
}

export const mdxComponents: Record<string, ElementType> = {
  Draw,
  a: ExternalLink,
  code: Code,
  pre: Pre,
  img: "img",
  video: "video",
};

export function MdxContent({ compiledSource }: { compiledSource: string }) {
  const { default: Content } = runSync(compiledSource, {
    ...devRuntime,
    ...runtime,
    baseUrl: import.meta.url,
  }) as { default: ComponentType<{ components?: Record<string, ElementType> }> };

  return <Content components={mdxComponents} />;
}
