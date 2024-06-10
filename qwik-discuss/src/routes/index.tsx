import { component$, useTask$ } from "@builder.io/qwik";
import {
  routeAction$,
  type DocumentHead,
  zod$,
  z,
  routeLoader$,
} from "@builder.io/qwik-city";
import type { Session } from "@prisma/client";
import { PostList } from "~/components/posts/post-list";

import { TopicCreateComponent } from "~/components/topics/topic-create-form";
import { TopicsList } from "~/components/topics/topics-list";
import { db } from "~/db/db";
import paths from "~/helpers/paths";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: "Must be lowercase letters or dashes without spaces",
    }),
  description: z.string().min(10),
});
interface CreateErrors {
  name?: string[];
  description?: string[];
  unexpected?: string[];
}

export const useCreateTopicAction = routeAction$(
  async (form, { fail, sharedMap, redirect }) => {
    const session: Session | null = sharedMap.get("session");

    if (!session || new Date(session.expires) < new Date()) {
      return fail(403, {
        message: "Invalid form",
        errors: {
          unexpected: ["You must be logged in to create a topic"],
        } as CreateErrors,
        FormData: form,
      });
    }
    const result = createTopicSchema.safeParse(form);

    if (!result.success) {
      return fail(400, {
        message: "Invalid form",
        errors: result.error.flatten().fieldErrors as CreateErrors,
        FormData: form,
      });
    }

    try {
      await db.topic.create({
        data: {
          slug: result.data.name,
          description: result.data.description,
        },
      });
      redirect(308, paths.topicShow(result.data.name));
    } catch (error: unknown) {
      if (error instanceof Error) {
        fail(500, {
          message: "Failed to create topic",
          errors: {
            unexpected: [error.message],
          },
          FormData: form,
        });
      } else {
        fail(500, {
          message: "Failed to create topic",
          errors: {
            unexpected: ["Unknown error"],
          },
          FormData: form,
        });
      }
    }
  },
  zod$({
    name: z.string(),
    description: z.string(),
  }),
);

export const useTopicsList = routeLoader$(async ({ cacheControl }) => {
  cacheControl({
    noCache: true,
  });
  return await db.topic.findMany();
});

export default component$(() => {
  // useTask$(async () => {
  //   await db.user.deleteMany({});
  //   await db.post.deleteMany({});
  //   await db.topic.deleteMany({});
  //   await db.account.deleteMany({});
  //   await db.verificationToken.deleteMany({});
  //   await db.comment.deleteMany({});
  // });
  return (
    <div class="grid grid-cols-4 gap-4 p-4">
      <div class="col-span-3">
        <div class="m2 text-xl">Top Posts</div>
        <PostList />
      </div>
      <div class="border px-2 py-3 shadow">
        <div class="flex w-full justify-around">
          <TopicCreateComponent />
        </div>
        <span class="mb-1 flex items-center">
          <span class="h-px flex-1 bg-gray-400"></span>
          <span class="shrink-0 px-6 text-gray-500">Topics</span>
          <span class="h-px flex-1 bg-gray-400"></span>
        </span>
        <TopicsList />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik discuss",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
