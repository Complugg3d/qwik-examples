import { component$ } from "@builder.io/qwik";
import Hero from "~/components/hero/hero";
import ScaleImage from "~/media/scale.jpg";

export default component$(() => {
  return (
    <>
      <Hero
        img={ScaleImage}
        alt={"steel factory"}
        description={"Scale your app to infinity"}
      />
    </>
  );
});
