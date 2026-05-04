import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface BlogPostSummary {
  description?: string;
  href: string;
  pubDate: string;
  slug: string;
  tags: string[];
  timestamp: number;
  title: string;
}

const blogDirectory = path.join(process.cwd(), "app/content/blog");

function cleanFrontmatterValue(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return {};
  }

  const data: Record<string, string | string[]> = {};
  const lines = match[1].split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!keyMatch) {
      continue;
    }

    const [, key, rawValue] = keyMatch;

    if (rawValue === "") {
      const values: string[] = [];
      let nextIndex = index + 1;

      while (nextIndex < lines.length) {
        const itemMatch = lines[nextIndex].match(/^\s*-\s*(.*)$/);

        if (!itemMatch) {
          break;
        }

        values.push(cleanFrontmatterValue(itemMatch[1]));
        nextIndex += 1;
      }

      data[key] = values;
      index = nextIndex - 1;
    } else {
      data[key] = cleanFrontmatterValue(rawValue);
    }
  }

  return data;
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

export async function getBlogPosts() {
  const filenames = await readdir(blogDirectory);
  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md") || filename.endsWith(".mdx"))
      .map(async (filename) => {
        const source = await readFile(path.join(blogDirectory, filename), "utf8");
        const frontmatter = parseFrontmatter(source);
        const slug = filename.replace(/\.mdx?$/, "");
        const date = new Date(String(frontmatter.pubDate ?? ""));

        return {
          description:
            typeof frontmatter.description === "string" ? frontmatter.description : undefined,
          href: `/blog/${slug}`,
          pubDate: Number.isNaN(date.valueOf()) ? "" : formatPostDate(date),
          slug,
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          timestamp: Number.isNaN(date.valueOf()) ? 0 : date.valueOf(),
          title: typeof frontmatter.title === "string" ? frontmatter.title : slug,
        } satisfies BlogPostSummary;
      }),
  );

  return posts.sort((first, second) => second.timestamp - first.timestamp);
}
