import { component$ } from "@builder.io/qwik";
import Hero from "~/components/hero/hero";
import PerformanceImage from "~/media/performance.jpg";

export default component$(() => {
  return (
    <>
      <Hero
        img={PerformanceImage}
        alt={"welding"}
        description={"We serve high performance applications"}
      />
    </>
  );
});
