import type { MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { Content } from "~/components/content";
import { getBlogPosts } from "~/lib/blog.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Writing" },
    {
      name: "description",
      content: "",
    },
  ];
};

export async function loader() {
  return {
    posts: await getBlogPosts(),
  };
}

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <Content>
      <section className="flex h-full flex-col">
        <div className="shrink-0 border-b border-stone-200 px-5 py-3 dark:border-neutral-800">
          <h1 className="font-medium text-secondary">Writing</h1>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="divide-y divide-stone-200 dark:divide-neutral-800">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 no-underline transition hover:bg-stone-100 dark:hover:bg-neutral-800/60"
                  to={post.href}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <h2 className="shrink-0 truncate text-base">{post.title}</h2>

                    {post.description ? (
                      <p className="text-secondary min-w-0 truncate">{post.description}</p>
                    ) : null}

                    {post.tags.length > 0 ? (
                      <ul className="flex shrink-0 gap-1.5">
                        {post.tags.map((tag) => (
                          <li
                            className="rounded-full bg-stone-200 px-2 py-0.5 text-sm font-mono text-stone-600 dark:bg-neutral-800 dark:text-neutral-300"
                            key={tag}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <time className="text-secondary shrink-0 text-sm">{post.pubDate}</time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Content>
  );
}
