import { routeLoader$ } from "@builder.io/qwik-city";
import { fetchPost } from "~/db/queries/posts";

export const usePostByTopicSlug = routeLoader$(async ({ params }) => {
  const slug = params.slug;
  const response = await fetchPost(slug || undefined);

  return response;
});
