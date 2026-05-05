import { compile } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import { transformerNotationDiff, transformerNotationHighlight } from "@shikijs/transformers";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";
import { VFile } from "vfile";
import { matter } from "vfile-matter";

export interface BlogPostSummary {
  description?: string;
  href: string;
  pubDate: string;
  slug: string;
  tags: string[];
  timestamp: number;
  title: string;
}

export interface BlogPost extends BlogPostSummary {
  compiledSource: string;
  number: number;
  tableOfContents: TableOfContentsItem[];
}

export interface TableOfContentsItem {
  depth: number;
  id: string;
  text: string;
}

const blogDirectory = path.join(process.cwd(), "app/content/blog");

const remarkPlugins = [
  remarkFrontmatter,
  remarkGfm,
  remarkMdxCompatibility,
] satisfies PluggableList;
type Frontmatter = Record<string, unknown>;
type MdxNode = {
  attributes?: Array<{ name?: string; type?: string }>;
  children?: MdxNode[];
  type?: string;
};
type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type?: string;
  value?: unknown;
};

function remarkMdxCompatibility() {
  return (tree: MdxNode) => {
    removeMdxModuleStatements(tree);
    normalizeMdxJsxAttributes(tree);
  };
}

function removeMdxModuleStatements(node: MdxNode) {
  if (!node.children) {
    return;
  }

  node.children = node.children.filter((child) => child.type !== "mdxjsEsm");

  for (const child of node.children) {
    removeMdxModuleStatements(child);
  }
}

function normalizeMdxJsxAttributes(node: MdxNode) {
  if (node.attributes) {
    node.attributes = node.attributes
      .filter((attribute) => !attribute.name?.startsWith("client:"))
      .map((attribute) => {
        if (!attribute.name) {
          return attribute;
        }

        return {
          ...attribute,
          name: reactAttributeNames[attribute.name] ?? attribute.name,
        };
      });
  }

  for (const child of node.children ?? []) {
    normalizeMdxJsxAttributes(child);
  }
}

const reactAttributeNames: Record<string, string> = {
  autoplay: "autoPlay",
  class: "className",
  playsinline: "playsInline",
};

function collectText(node: HastNode): string {
  if (typeof node.value === "string") {
    return node.value;
  }

  return (node.children ?? []).map(collectText).join("");
}

function rehypeCollectTableOfContents(items: TableOfContentsItem[]) {
  return (tree: HastNode) => {
    visitHast(tree, (node) => {
      const match = node.tagName?.match(/^h([2-4])$/);
      const id = node.properties?.id;

      if (!match || typeof id !== "string") {
        return;
      }

      items.push({
        depth: Number(match[1]),
        id,
        text: collectText(node).trim(),
      });
    });
  };
}

function rehypeRemoveCodeTrail() {
  return (tree: HastNode) => {
    visitHast(tree, (node) => {
      if (node.tagName !== "pre") {
        return;
      }

      const code = node.children?.find((child) => child.tagName === "code");
      if (!code?.children?.length) {
        return;
      }

      const lastChild = code.children.at(-1);
      if (lastChild?.type === "text" && lastChild.value === "\n") {
        code.children.pop();
      }
    });
  };
}

function visitHast(node: HastNode, visitor: (node: HastNode) => void) {
  visitor(node);

  for (const child of node.children ?? []) {
    visitHast(child, visitor);
  }
}

function formatPostDate(date: Date) {
  const currentYear = new Date().getFullYear();
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "short" });
  const year = date.getFullYear();

  if (year === currentYear) {
    return `${day} ${month}`;
  }

  return `${day} ${month} ${year}`;
}

function getString(frontmatter: Frontmatter, key: string) {
  const value = frontmatter[key];

  return typeof value === "string" ? value : undefined;
}

function getStringList(frontmatter: Frontmatter, key: string) {
  const value = frontmatter[key];

  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function getPostSummary(slug: string, frontmatter: Frontmatter): BlogPostSummary {
  const date = new Date(getString(frontmatter, "pubDate") ?? "");

  return {
    description: getString(frontmatter, "description"),
    href: `/blog/${slug}`,
    pubDate: Number.isNaN(date.valueOf()) ? "" : formatPostDate(date),
    slug,
    tags: getStringList(frontmatter, "tags"),
    timestamp: Number.isNaN(date.valueOf()) ? 0 : date.valueOf(),
    title: getString(frontmatter, "title") ?? slug,
  };
}

async function readPostFile(slug: string) {
  const sourcePath = path.join(blogDirectory, `${slug}.mdx`);
  const markdownPath = path.join(blogDirectory, `${slug}.md`);

  try {
    return await readFile(sourcePath, "utf8");
  } catch (sourceError) {
    try {
      return await readFile(markdownPath, "utf8");
    } catch {
      throw sourceError;
    }
  }
}

function parsePostSource(source: string) {
  const file = new VFile({ value: source });
  matter(file, { strip: true });

  return {
    body: normalizeMdxVoidTags(String(file)),
    frontmatter: (file.data.matter ?? {}) as Frontmatter,
  };
}

function normalizeMdxVoidTags(source: string) {
  return source.replace(
    /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s[^<>]*?)?>/gi,
    (match, tag: string, attributes = "") => {
      if (match.endsWith("/>")) {
        return match;
      }

      return `<${tag}${attributes} />`;
    },
  );
}

export async function compileMdx(source: string) {
  const tableOfContents: TableOfContentsItem[] = [];
  const compiled = await compile(source, {
    development: process.env.NODE_ENV === "development",
    outputFormat: "function-body",
    rehypePlugins: [
      rehypeSlug,
      [rehypeCollectTableOfContents, tableOfContents],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["mdx-heading-anchor"],
          },
        },
      ],
      [
        rehypeShiki,
        {
          addLanguageClass: true,
          defaultLanguage: "text",
          themes: {
            light: "snazzy-light",
            dark: "vitesse-dark",
          },
          transformers: [transformerNotationDiff(), transformerNotationHighlight()],
        },
      ],
      rehypeRemoveCodeTrail,
    ] satisfies PluggableList,
    remarkPlugins,
  });

  return {
    compiledSource: String(compiled),
    tableOfContents,
  };
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return undefined;
  }

  try {
    const source = await readPostFile(slug);
    const { body, frontmatter } = parsePostSource(source);
    const posts = await getBlogPosts();
    const number = posts.findIndex((post) => post.slug === slug) + 1;
    const compiled = await compileMdx(body);

    return {
      ...getPostSummary(slug, frontmatter),
      ...compiled,
      number: number || posts.length + 1,
    };
  } catch {
    return undefined;
  }
}

export async function getBlogPosts() {
  const filenames = await readdir(blogDirectory);
  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md") || filename.endsWith(".mdx"))
      .map(async (filename) => {
        const slug = filename.replace(/\.mdx?$/, "");
        const source = await readFile(path.join(blogDirectory, filename), "utf8");
        const { frontmatter } = parsePostSource(source);

        return getPostSummary(slug, frontmatter);
      }),
  );

  return posts.sort((first, second) => second.timestamp - first.timestamp);
}
