import type { JSXNode } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import paths from "~/helpers/paths";
import {
  useAuthSession,
  useAuthSignin,
  useAuthSignout,
} from "~/routes/plugin@auth";

export const NavbarHeader = component$(() => {
  const session = useAuthSession();
  const signIn = useAuthSignin();
  const signOut = useAuthSignout();
  const showSignal = useSignal(false);

  let authContent: JSXNode;
  if (session.value?.user) {
    authContent = (
      <div class="relative inline-block">
        <div
          onClick$={() => {
            showSignal.value = !showSignal.value;
          }}
          style={{
            backgroundImage: `url("${session.value.user.image || ""}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          class="h-8 w-8 cursor-pointer rounded-full"
        ></div>

        <div
          class={`${showSignal.value ? "visible animate-scaleIn" : "invisible animate-scaleOut delay-200"} absolute right-full origin-top-right z-50 mt-2 w-40 rounded-md bg-white shadow-lg`}
        >
          <div class="flex items-center p-4">
            <div>
              <button
                onClick$={() => signOut.submit({ callbackUrl: "/" })}
                class="inline-block w-20 rounded border border-teal-600 font-medium text-teal-600 hover:bg-teal-600 hover:text-white focus:outline-none focus:ring active:bg-teal-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    authContent = (
      <div>
        <button
          onClick$={() =>
            signIn.submit({
              providerId: "github",
              options: {
                callbackUrl: "http://qwik-auth-example.com/dashboard",
              },
            })
          }
          class="inline-block rounded border border-teal-600 bg-teal-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-teal-600 focus:outline-none focus:ring active:text-teal-500"
        >
          Sign In
        </button>
        <button
          onClick$={() =>
            signIn.submit({
              providerId: "github",
              options: {
                callbackUrl: "http://qwik-auth-example.com/dashboard",
              },
            })
          }
          class="ml-1 inline-block rounded border border-teal-200 bg-teal-100 px-12 py-3 text-sm font-medium text-teal-600 hover:bg-transparent hover:text-teal-400 focus:outline-none focus:ring active:text-teal-100"
        >
          Sign up
        </button>
      </div>
    );
  }

  return (
    <header class="bg-gray-50 shadow-md">
      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="md:flex md:items-center md:gap-12">
            <Link class="block text-teal-600" href={paths.home()}>
              <span>Home</span>
            </Link>
          </div>

          <div class="hidden md:block">
            <nav aria-label="Global">
              <div class="flex h-full items-center">
                <input
                  type="text"
                  id="search"
                  placeholder="search"
                  class="mt-1 h-12 w-full rounded-md border-gray-200 p-3 shadow-sm sm:text-sm"
                />
              </div>
            </nav>
          </div>

          <div class="flex items-center gap-4">{authContent}</div>
        </div>
      </div>
    </header>
  );
});
