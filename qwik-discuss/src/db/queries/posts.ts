// import type { Post } from "@prisma/client";
import { db } from "../db";

// export type PostWithData = Post & {
//   topic: { slug: string };
//   user: { name: string | null };
//   _count: { comments: number };
// };

export type PostWithData = Awaited<ReturnType<typeof fetchPost>>[number];

export function fetchPost({ slug, term }: { slug?: string; term?: string }) {
  if (slug) {
    const result = db.post.findMany({
      where: {
        topic: {
          slug,
        },
      },
      include: {
        topic: {
          select: {
            slug: true,
          },
        },
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return result;
  }

  if (term) {
    const result = db.post.findMany({
      where: {
        OR: [{ title: { contains: term } }, { content: { contains: term } }],
      },
      include: {
        topic: {
          select: {
            slug: true,
          },
        },
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return result;
  }

  return db.post.findMany({
    orderBy: {
      comments: {
        _count: "desc",
      },
    },
    take: 5,
    include: {
      topic: {
        select: {
          slug: true,
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
}
