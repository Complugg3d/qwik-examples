import { component$ } from "@builder.io/qwik";

import { CommentCreateForm } from "./comment-create-form";
import { useCommentsList } from "~/routes/topics/[slug]/posts/[id]";

interface CommentShowProps {
  commentId: string;
}

export const CommentShow = component$(({ commentId }: CommentShowProps) => {
  const commentsSignal = useCommentsList();
  const comment = commentsSignal.value.find((c) => c.id === commentId);

  if (!comment) {
    return null;
  }

  const children = commentsSignal.value.filter((c) => c.parentId === commentId);
  const renderedChildren = children.map((child) => {
    return <CommentShow key={child.id} commentId={child.id} />;
  });
  return (
    <div class="mb-1 mt-2 border p-4">
      <div class="flex gap-3">
        <img
          src={comment.user.image || ""}
          alt="user image"
          width={40}
          height={40}
          class="h-10 w-10 rounded-full"
        />
        <div class="flex-1 space-y-3">
          <p class="text-sm font-medium text-gray-500">{comment.user.name}</p>
          <p class="text-gray-900">{comment.content}</p>

          <CommentCreateForm postId={comment.postId} parentId={comment.id} />
        </div>
      </div>
      <div class="pl-4">{renderedChildren}</div>
    </div>
  );
});
