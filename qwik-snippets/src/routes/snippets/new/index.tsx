import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { db } from "~/db/db";

export const useCreateSnippetAction = routeAction$(
  async (form, { fail, redirect }) => {
    const { title, code } = form;
    if (!title || title.length < 3) {
      return fail(400, {
        message: "Title must be longer",
        FormData: { title, code },
      });
    }
    if (!code || code.length < 10) {
      return fail(400, {
        message: "Code must be longer",
        FormData: { title, code },
      });
    }

    const snippet = await db.snippet.create({
      data: {
        title,
        code,
      },
    });
    console.log("Creating snippet", { title, code });
    console.log("Creating snippet", snippet);
    if (snippet.id) {
      redirect(308, `/snippets/${snippet.id}`);
    }
  },
  zod$({
    title: z.string(),
    code: z.string(),
  }),
);

export default component$(() => {
  const action = useCreateSnippetAction();

  console.log("action", action);


  return (
    <Form action={action}>
      <h3 class="m-3 font-bold">Create New Snippet</h3>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <label for="title" class="w-12">
            Title
          </label>
          <input
            type="text"
            class="w-full rounded border p-2"
            name="title"
            id="title"
            value={action.formData?.get("title")?.toString() || ""}
          />
        </div>
        <div class="flex gap-4">
          <label for="code" class="w-12">
            Code
          </label>
          <textarea
            value={action.formData?.get("code")?.toString() || ""}
            name="code"
            id="code"
            class="w-full rounded border p-2"
          ></textarea>
        </div>
        <div>
          {action.value?.message && (
            <p class="my-2 rounded border border-red-400 bg-red-200 p-2 text-red-500">
              {action.value.message}
            </p>
          )}
        </div>
        <button type="submit" class="rounded bg-blue-200 p-2">
          Create
        </button>
      </div>
    </Form>
  );
});
