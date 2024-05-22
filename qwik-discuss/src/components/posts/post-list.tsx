import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import paths from "~/helpers/paths";
import { usePostByTopicSlug } from "~/routes/topics/[slug]";

export const PostList = component$(() => {
  const postListSignal = usePostByTopicSlug();

  return (
    <>
      {postListSignal.value.map((post) => {
        return (
          <div key={post.id} class="mb-2 rounded border p-2">
            <Link href={paths.postShow(post.topic.slug, post.id)}>
              <h3 class="text-lg font-bold">{post.title}</h3>
              <div class="flex flex-row gap-8">
                <p class="text-xs text-gray-400">By {post.user.name}</p>
                <p class="text-xs text-gray-400">
                  {post._count.comments} comments
                </p>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
});
