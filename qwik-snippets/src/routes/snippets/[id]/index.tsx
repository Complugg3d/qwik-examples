import { component$ } from "@builder.io/qwik";
import {
  Form,
  Link,
  routeAction$,
  routeLoader$,
} from "@builder.io/qwik-city";
import { db } from "~/db/db";

export const useReadShowSnippet = routeLoader$(async (request) => {
  const { id } = request.params;
  const updated = request.url.searchParams.get("updated") === "true";

  const snippet = await db.snippet.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!snippet) {
    return request.fail(404, { message: "Snippet not found" });
  }

  if (updated) {
    request.cacheControl({ noCache: true });
  }
  return snippet;
});

export const useDeleteSnippet = routeAction$(async (form, request) => {
  await db.snippet.delete({
    where: {
      id: +form.id,
    },
  });
  throw request.redirect(308, `/`);
});

export const SnippetsShow = component$(() => {
  const snippet = useReadShowSnippet();
  const deleteAction = useDeleteSnippet();

  return (
    <>
      {snippet.value.code ? (
        <div>
          <div class="rounded border p-4">
            <div
              style={{
                justifyContent: "space-between",
                margin: "1rem",
              }}
              class="m-4 flex items-center justify-between"
            >
              <h3 class="text-xl font-bold">{snippet.value?.title}</h3>
              <div class="flex gap-4">
                <Link
                  prefetch
                  class="rounded border p-2"
                  href={`/snippets/${snippet.value?.id}/edit`}
                >
                  Edit
                </Link>
                <Form action={deleteAction}>
                  <input
                    name="id"
                    id="id"
                    type="hidden"
                    value={snippet.value.id}
                  />
                  <button class="rounded border p-2">Delete</button>
                </Form>
              </div>
            </div>
            <pre class="rounded bg-gray-100 p-2">
              <code>{snippet.value?.code}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div>Not found</div>
      )}
    </>
  );
});

export default SnippetsShow;
