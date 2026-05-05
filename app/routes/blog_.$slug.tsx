import type { MetaFunction } from "react-router";
import { data, Link, useLoaderData } from "react-router";
import { Content } from "~/components/content";
import { MdxContent } from "~/components/mdx";
import { getBlogPost } from "~/lib/blog.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [{ title: "Writing" }];
  }

  return [
    { title: data.post.title },
    {
      name: "description",
      content: data.post.description ?? "",
    },
  ];
};

export async function loader({ params }: { params: { slug?: string } }) {
  const post = params.slug ? await getBlogPost(params.slug) : undefined;

  if (!post) {
    throw data("Post not found", { status: 404 });
  }

  return { post };
}

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Content>
      <section className="flex h-full flex-col">
        <div className="shrink-0 border-b border-stone-200 px-5 py-3 dark:border-neutral-800">
          <Link className="flex min-w-0 items-center gap-2 no-underline" to="/blog">
            <span className="shrink-0 font-medium text-secondary">Writing</span>
            <span className="i-solar-alt-arrow-right-line-duotone shrink-0 text-secondary" />
            <span className="min-w-0 truncate font-medium">
              <span className="text-secondary">#{post.number}</span> {post.title}
            </span>
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <article className="grid gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-16 xl:px-24">
            <div className="min-w-0">
              <header className="max-w-3xl">
                <h1 className="text-4xl font-semibold leading-tight text-stone-950 dark:text-white">
                  {post.title}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-lg text-secondary">
                  {post.description ? <p>{post.description}</p> : null}
                  {post.pubDate ? (
                    <>
                      <span className="text-stone-300 dark:text-neutral-700">/</span>
                      <time>{post.pubDate}</time>
                    </>
                  ) : null}
                </div>
              </header>

              <div className="mdx-post mt-12 max-w-3xl">
                <MdxContent compiledSource={post.compiledSource} />
              </div>
            </div>

            {post.tableOfContents.length ? (
              <aside className="hidden lg:block">
                <nav
                  aria-label="Table of contents"
                  className="sticky top-8 border-l border-stone-200 pl-5 text-sm dark:border-neutral-800"
                >
                  <h2 className="font-medium text-stone-950 dark:text-white">Contents</h2>

                  <ol className="mt-4 space-y-2">
                    {post.tableOfContents.map((item) => (
                      <li className={item.depth > 2 ? "pl-4" : undefined} key={item.id}>
                        <a
                          className="block text-secondary no-underline transition hover:text-stone-950 dark:hover:text-white"
                          href={`#${item.id}`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>
            ) : (
              <div aria-hidden="true" className="hidden lg:block" />
            )}
          </article>
        </div>
      </section>
    </Content>
  );
}
