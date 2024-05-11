import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useCreatePost } from "~/routes/topics/[slug]";

export const PostCreateForm = component$(() => {
  const createPostSignal = useCreatePost();
  const showSignal = useSignal(false);
  const formSignalRef = useSignal<HTMLFormElement>();

  useTask$(({ track }) => {
    track(() => showSignal.value);

    if (!showSignal.value) {
      formSignalRef.value?.reset();
    }
  });

  return (
    <div class="relative inline-block">
      <button
        onClick$={() => {
          showSignal.value = !showSignal.value;
        }}
        class="inline-block rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
      >
        Create a Post
      </button>

      <div
        class={`${showSignal.value ? "visible animate-scaleIn" : "invisible animate-scaleOut delay-200"} absolute right-full mt-2 origin-top-right rounded-md bg-slate-50 p-4 shadow-lg`}
      >
        <div class="py-1" role="menu" aria-orientation="vertical">
          <Form ref={formSignalRef} action={createPostSignal}>
            <div class="flex w-80 flex-col gap-4">
              <h3 class="text-lg">Create a post</h3>
            </div>
            <div class="mb-2">
              <label
                for="title"
                class={`block text-sm font-medium text-gray-700 ${createPostSignal.value?.errors?.title ? "text-red-500" : ""}`}
              >
                Name
              </label>

              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                value={createPostSignal.formData?.get("title") || ""}
                class={`mt-1 h-8 w-full rounded-md border-gray-200 bg-gray-100 p-2 shadow-sm sm:text-sm ${createPostSignal.value?.errors?.title ? "border-red-400 bg-red-200 p-2 text-red-500" : ""}`}
              />

              {createPostSignal.value?.errors?.title && (
                <p class="mt-1 text-xs text-red-500">
                  {createPostSignal.value.errors.title.join(", ")}
                </p>
              )}
            </div>

            <div class="mb-2">
              <label
                for="content"
                class={`block text-sm font-medium text-gray-700 ${createPostSignal.value?.errors?.content ? "text-red-500" : ""}`}
              >
                Description
              </label>

              <textarea
                id="content"
                name="content"
                class={`mt-2 w-full rounded-lg border-gray-200 bg-gray-100 p-2 align-top shadow-sm sm:text-sm ${createPostSignal.value?.errors?.content ? "border-red-400 bg-red-200 p-2 text-red-500" : ""}`}
                rows={4}
                value={
                  createPostSignal.formData?.get("content")?.toString() || ""
                }
                placeholder="Your comments here"
              ></textarea>
              {createPostSignal.value?.errors?.content && (
                <p class="mt-1 text-xs text-red-500">
                  {createPostSignal.value.errors.content.join(", ")}
                </p>
              )}
            </div>

            <div>
              {createPostSignal.value?.errors?.unexpected && (
                <p class="my-2 rounded border border-red-400 bg-red-200 p-2 text-red-500">
                  {createPostSignal.value.errors.unexpected.join(", ")}
                </p>
              )}
            </div>

            <button
              type="submit"
              class="inline-block w-full rounded border border-blue-400 bg-blue-400 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-400 focus:outline-none focus:ring active:text-blue-300"
            >
              Create a post
            </button>
          </Form>
        </div>
      </div>
      {createPostSignal.isRunning && (
        <div class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-gray-200 bg-opacity-50">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
});
