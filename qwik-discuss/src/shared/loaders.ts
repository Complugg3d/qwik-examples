import { routeLoader$ } from "@builder.io/qwik-city";
import { fetchPost } from "~/db/queries/posts";
import paths from "~/helpers/paths";

// eslint-disable-next-line qwik/loader-location
export const usePostList = routeLoader$(
  async ({ params, url, pathname, redirect, cacheControl }) => {
    cacheControl({
      noCache: true,
    });

    const term = url.searchParams.get("term") || "";

    if (pathname.includes("/search") && !term) {
      throw redirect(308, paths.home());
    }

    const slug = params.slug;

    const response = await fetchPost({ slug, term });

    return response;
  },
);
