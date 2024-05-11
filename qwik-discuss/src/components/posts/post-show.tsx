import { component$ } from "@builder.io/qwik";
import { usePostById } from "~/routes/topics/[slug]/posts/[id]";

export const PostShowComponent = component$(() => {
  const postById = usePostById();
  return (
    <div class="m-4">
      <h1 class="my-2 text-2xl font-bold">{postById.value?.title}</h1>
      <p class="rounded border p-4">{postById.value?.content}</p>
    </div>
  );
});
