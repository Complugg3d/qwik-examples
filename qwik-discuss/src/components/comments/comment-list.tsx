import { component$ } from "@builder.io/qwik";
import { useCommentsList } from "~/routes/topics/[slug]/posts/[id]";
import { CommentShow } from "./comment-show";

export const CommentList = component$(() => {
  const commentsSignal = useCommentsList();

  const topLevelComments = commentsSignal.value.filter(
    (comment) => comment.parentId === null,
  );

  const renderedComments = topLevelComments.map((comment) => {
    return <CommentShow key={comment.id} commentId={comment.id} />;
  });

  return (
    <div class="space-y-3">
      <h1 class="text-lg font-bold">
        All {commentsSignal.value.length} comments
      </h1>
      {renderedComments}
    </div>
  );
});
