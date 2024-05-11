import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";

export default component$<{
  img: string;
  alt: string;
  description: string;
}>(({ img, alt, description }) => {
  return (
    <>
      <Image
        alt={alt}
        src={img}

        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: -10,
          inset: 0,
        }}
      />
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(94,75,173,1) 35%, rgba(240,242,242,1) 100%)",
          position: "absolute",
          zIndex: -5,
          inset: 0,
          opacity: 0.5,
        }}
      ></div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "4rem",
            textShadow: "0 0 10px black",
          }}
        >
          {description}
        </h1>
      </div>
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
