import { serverAuth$ } from "@builder.io/qwik-auth";
import GitHub from "@auth/core/providers/github";
import type { Provider } from "@auth/core/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/db/db";

const adapter = PrismaAdapter(db);
export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    adapter,
    secret: env.get("AUTH_SECRET"),
    trustHost: true,
    providers: [
      GitHub({
        clientId: env.get("GITHUB_ID")!,
        clientSecret: env.get("GITHUB_SECRET")!,
        profile(profile) {
          console.log("emgv profile", profile);
          if (profile.login === env.get("USER_PROFILE")!) {
            return {
              id: profile.id.toString(),
              name: profile.name,
              email: profile.email,
              image: profile.avatar_url,
              role: "admin",
            };
          }
          return {
            id: profile.id.toString(),
            name: profile.name,
            email: profile.email,
            image: profile.avatar_url,
            role: profile.role ?? "user",
          };
        },
      }),
    ] as Provider[],
    callbacks: {
      async session({ session, user }: any) {
        if (session && user) {
          session.user.id = user.id;
          session.user.role = user.role;
        }
        return session;
      },
    },
  }));
