import { component$ } from "@builder.io/qwik";
import {
  Link,
  routeAction$,
  routeLoader$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";
import type { Session } from "@prisma/client";

import { CommentCreateForm } from "~/components/comments/comment-create-form";
import { CommentList } from "~/components/comments/comment-list";
import { PostShowComponent } from "~/components/posts/post-show";
import { db } from "~/db/db";
import { fetchComments } from "~/db/queries/comments";
import paths from "~/helpers/paths";

export const usePostById = routeLoader$(async ({ params }) => {
  const postId = params.id;
  return await db.post.findFirst({
    where: {
      id: postId,
    },
  });
});

const createCommentSchema = z.object({
  comment: z.string().min(3),
});

interface CreateCommentErrors {
  comment?: string[];
  unexpected?: string[];
}

export const useCreateComment = routeAction$(
  async (form, { sharedMap, fail, params, cacheControl }) => {
    const session:
      | (Session & {
          user: {
            name: string;
            email: string;
            image: string;
            id: string;
          };
        })
      | null = sharedMap.get("session");

    if (!session || new Date(session.expires) < new Date()) {
      return fail(403, {
        message: "Invalid form",
        errors: {
          unexpected: ["You must be logged in to create a post"],
        } as CreateCommentErrors,
        FormData: form,
      });
    }

    const result = createCommentSchema.safeParse(form);
    if (!result.success) {
      return fail(400, {
        message: "Invalid form",
        errors: result.error.flatten().fieldErrors as CreateCommentErrors,
        FormData: form,
      });
    }

    try {
      await db.comment.create({
        data: {
          content: result.data.comment,
          postId: params.id,
          parentId: form.parentId,
          userId: session.user.id,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        return {
          errors: {
            unexpected: [err.message],
          } as CreateCommentErrors,
        };
      } else {
        return {
          errors: {
            unexpected: ["Something went wrong..."],
          } as CreateCommentErrors,
        };
      }
    }

    const topic = await db.topic.findFirst({
      where: { posts: { some: { id: form.parentId } } },
    });

    if (!topic) {
      return {
        errors: {
          unexpected: ["Failed to revalidate topic"],
        } as CreateCommentErrors,
      };
    }

    cacheControl({
      noCache: true,
    });
  },
  zod$({ comment: z.string(), parentId: z.string().optional() }),
);

export const useCommentsList = routeLoader$(async ({ params }) => {
  return await fetchComments(params.id);
});

export const PostShow = component$(() => {
  const location = useLocation();
  const slug = location.params.slug;

  return (
    <div class="space-y-3">
      <Link class="underline decoration-solid" href={paths.topicShow(slug)}>
        {"< "}Back to {slug}
      </Link>
      <PostShowComponent />
      <CommentCreateForm showOpen />
      <CommentList />
    </div>
  );
});

export default PostShow;
