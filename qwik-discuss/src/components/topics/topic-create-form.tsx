import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";

import { useCreateTopicAction } from "~/routes";

export const TopicCreateComponent = component$(() => {
  const createTopicSignal = useCreateTopicAction();
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
        Create a topic
      </button>

      <div
        class={`${showSignal.value ? "visible animate-scaleIn" : "invisible animate-scaleOut delay-200"} absolute right-full origin-top-right rounded-md p-4 bg-slate-50 shadow-lg`}
      >
        <div class="py-1" role="menu" aria-orientation="vertical">
          <Form ref={formSignalRef} action={createTopicSignal}>
            <div class="flex w-80 flex-col gap-4">
              <h3 class="text-lg">Create a topic</h3>
            </div>
            <div class="mb-2">
              <label
                for="name"
                class={`block text-sm font-medium text-gray-700 ${createTopicSignal.value?.errors?.name ? "text-red-500" : ""}`}
              >
                Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder="name"
                value={createTopicSignal.formData?.get("name") || ""}
                class={`mt-1 h-8 w-full rounded-md border-gray-200 bg-gray-100 p-2 shadow-sm sm:text-sm ${createTopicSignal.value?.errors?.name ? "border-red-400 bg-red-200 p-2 text-red-500" : ""}`}
              />

              {createTopicSignal.value?.errors?.name && (
                <p class="mt-1 text-xs text-red-500">
                  {createTopicSignal.value.errors.name.join(", ")}
                </p>
              )}
            </div>

            <div class="mb-2">
              <label
                for="OrderNotes"
                class={`block text-sm font-medium text-gray-700 ${createTopicSignal.value?.errors?.description ? "text-red-500" : ""}`}
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                class={`mt-2 w-full rounded-lg border-gray-200 bg-gray-100 p-2 align-top shadow-sm sm:text-sm ${createTopicSignal.value?.errors?.description ? "border-red-400 bg-red-200 p-2 text-red-500" : ""}`}
                rows={4}
                value={
                  createTopicSignal.formData?.get("description")?.toString() ||
                  ""
                }
                placeholder="Describe your topic"
              ></textarea>
              {createTopicSignal.value?.errors?.description && (
                <p class="mt-1 text-xs text-red-500">
                  {createTopicSignal.value.errors.description.join(", ")}
                </p>
              )}
            </div>

            <div>
              {createTopicSignal.value?.errors?.unexpected && (
                <p class="my-2 rounded border border-red-400 bg-red-200 p-2 text-red-500">
                  {createTopicSignal.value.errors.unexpected.join(", ")}
                </p>
              )}
            </div>

            <button
              type="submit"
              class="inline-block w-full rounded border border-blue-400 bg-blue-400 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-400 focus:outline-none focus:ring active:text-blue-300"
            >
              Create a topic
            </button>
          </Form>
        </div>
      </div>
      {createTopicSignal.isRunning && (
        <div class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-gray-200 bg-opacity-50">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
});
