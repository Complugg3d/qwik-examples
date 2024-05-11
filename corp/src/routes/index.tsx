import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import Hero from "~/components/hero/hero";
import homeImg from "~/media/home.jpg";

export default component$(() => {
  return (
    <>
      <Hero
        img={homeImg}
        alt={"Cart factory"}
        description={"Professional cloud hosting"}
      />
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
