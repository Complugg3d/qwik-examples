import { component$, Slot } from "@builder.io/qwik";
import {
  routeAction$,
  z,
  zod$,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { NavbarHeader } from "~/components/navbar-header/navbar-header";
import paths from "~/helpers/paths";
export { usePostList } from "~/shared/loaders";

export const useSearchAction = routeAction$(
  async (form, { redirect }) => {
    const term = form.term;

    if (typeof term !== "string" || !term) {
      redirect(308, paths.home());
    }

    const search = paths.search(term);

    redirect(308, search);
  },
  zod$({
    term: z.string(),
  }),
);

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="container mx-auto max-w-6xl px-4">
      <NavbarHeader />
      <div class="mt-4">
        <Slot />
      </div>
    </div>
  );
});
