import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, Link } from "@builder.io/qwik-city";

import { db } from "~/db/db";

export const useSnippets = routeLoader$(async () => {
  return await db.snippet.findMany();
});

export default component$(() => {
  const snippets = useSnippets();

  const renderedSnippets = snippets.value.map((snippet) => {
    return (
      <Link
        key={snippet.id}
        prefetch
        class="flex items-center justify-between rounded border p-2 "
        href={`/snippets/${snippet.id}`}
      >
        <div key={snippet.id}>
          <h3 class="font-bold">{snippet.title}</h3>
        </div>
        <p>View</p>
      </Link>
    );
  });

  return (
    <div class="flex flex-col gap-2">
      <div class="m-2 flex items-center justify-between">
        <h1 class="text-xl font-bold">Snippets</h1>
        <Link href="/snippets/new" class="rounded border p-2">
          Create a Snippet
        </Link>
      </div>
      {renderedSnippets}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
