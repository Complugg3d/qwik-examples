import { routeLoader$ } from "@builder.io/qwik-city";
import { fetchPost } from "~/db/queries/posts";

// eslint-disable-next-line qwik/loader-location
export const usePostList = routeLoader$(async ({ params }) => {
  const slug = params.slug;
  const response = await fetchPost(slug || undefined);

  return response;
});
