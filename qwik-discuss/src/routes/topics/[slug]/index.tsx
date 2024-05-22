import { component$ } from "@builder.io/qwik";
import { routeAction$, useLocation, z, zod$ } from "@builder.io/qwik-city";
import type { Session } from "@prisma/client";
import { PostCreateForm } from "~/components/posts/post-create-form";
import { PostList } from "~/components/posts/post-list";
import { db } from "~/db/db";

export { usePostByTopicSlug } from "~/shared/loaders";

import paths from "~/helpers/paths";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

interface CreatePostErrors {
  title?: string[];
  content?: string[];
  unexpected?: string[];
}

export const useCreatePost = routeAction$(
  async (form, { sharedMap, fail, params, redirect }) => {
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
        } as CreatePostErrors,
        FormData: form,
      });
    }

    const result = createPostSchema.safeParse(form);
    if (!result.success) {
      return fail(400, {
        message: "Invalid form",
        errors: result.error.flatten().fieldErrors as CreatePostErrors,
        FormData: form,
      });
    }

    try {
      const topic = await db.topic.findFirst({
        where: {
          slug: params.slug,
        },
      });

      if (!topic) {
        throw new Error("Topic not found");
      }

      const post = await db.post.create({
        data: {
          title: result.data.title,
          content: result.data.content,
          topicId: topic.id,
          userId: session.user.id,
        },
      });
      redirect(308, paths.postShow(params.slug, post.id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          errors: { unexpected: [(error as Error).message] },
        } as CreatePostErrors;
      } else {
        return {
          errors: { unexpected: ["An unknown error occurred"] },
        } as CreatePostErrors;
      }
    }
  },
  zod$({
    title: z.string(),
    content: z.string(),
  }),
);

export const TopicsShow = component$(() => {
  const location = useLocation();
  return (
    <div class="grid grid-cols-4 gap-4 p-4">
      <div class="col-span-3">
        <h1 class="mb-2 text-2xl font-bold">{location.params.slug}</h1>
        <PostList />
      </div>
      <div>
        <PostCreateForm />
      </div>
    </div>
  );
});

export default TopicsShow;
