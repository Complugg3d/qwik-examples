import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useCreateComment } from "~/routes/topics/[slug]/posts/[id]";

export const CommentCreateForm = component$(
  ({
    parentId,
    showOpen,
  }: {
    parentId?: string;
    showOpen?: boolean;
    postId?: string;
  }) => {
    const createCommentSignal = useCreateComment();
    const formSignalRef = useSignal<HTMLFormElement>();

    const openSignal = useSignal(showOpen);
    useTask$(({ track }) => {
      track(() => showOpen);
      track(() => createCommentSignal.status);

      if (createCommentSignal.status === 200) {
        formSignalRef.value?.reset();

        if (!showOpen) {
          openSignal.value = false;
        }
      }
    });

    return (
      <>
        <button
          onClick$={() => {
            openSignal.value = !openSignal.value;
          }}
          class="inline-block w-12 rounded border border-blue-400 text-sm font-medium text-blue-400 hover:border-blue-600 hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-600"
        >
          Reply
        </button>

        {openSignal.value && (
          <Form
            ref={formSignalRef}
            action={createCommentSignal}
            spaReset
            onSubmitCompleted$={(event) => {
              event.preventDefault();
              if (createCommentSignal.status === 200) {
                createCommentSignal.formData?.set("comment", "");
                formSignalRef.value?.reset();
              }
            }}
          >
            <div class="mb-2">
              <label
                for="comment"
                class={`block text-sm font-medium text-gray-700 ${createCommentSignal.value?.errors?.comment ? "text-red-500" : ""}`}
              >
                Repply
              </label>

              <textarea
                id="comment"
                name="comment"
                placeholder="Add a comment..."
                value={
                  createCommentSignal.formData?.get("comment")?.toString() || ""
                }
                class={`mt-2 w-full rounded-lg border-gray-200 bg-gray-100 p-2 align-top shadow-sm sm:text-sm ${createCommentSignal.value?.errors?.comment ? "border-red-400 bg-red-200 p-2 text-red-500" : ""}`}
              />

              {parentId && (
                <input type="hidden" name="parentId" value={parentId} />
              )}

              {createCommentSignal.value?.errors?.comment && (
                <p class="mt-1 text-xs text-red-500">
                  {createCommentSignal.value.errors.comment.join(", ")}
                </p>
              )}
            </div>

            <button
              type="submit"
              class="inline-block rounded border border-blue-400 bg-blue-400 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-400 focus:outline-none focus:ring active:text-blue-300"
            >
              Create comment
            </button>
          </Form>
        )}
      </>
    );
  },
);
