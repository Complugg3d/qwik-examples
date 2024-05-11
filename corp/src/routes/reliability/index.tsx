import { component$ } from "@builder.io/qwik";
import Hero from "~/components/hero/hero";
import ReliabilityImg from "~/media/reliability.jpg";

export default component$(() => {
  return (
    <>
      <Hero
        img={ReliabilityImg}
        alt={"welding"}
        description={"Super high reliability hosting"}
      />
    </>
  );
});
