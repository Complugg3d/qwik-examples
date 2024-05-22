import { db } from "../db";

export type CommentWithAuthor = Awaited<
  ReturnType<typeof fetchComments>
>[number];

export function fetchComments(postId?: string) {
  console.log("emgv fetchComments query", postId);
  if (!postId) {
    return db.comment.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }
  return db.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}
