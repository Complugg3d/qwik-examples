import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

export const QuillExample = component$(() => {
  const containerRef = useSignal<HTMLDivElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (!containerRef.value) return;

    new Quill(containerRef.value, {
      modules: {
        toolbar: [
          // make it false to hide toolbar
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block", "link", "blockquote", "list"],
        ],
      },
      placeholder: "Compose an epic...",
      theme: "snow", // or 'bubble'
    }).on("text-change", (delta, oldDelta, source) => {
      console.log("text-change", delta, oldDelta, source); // delta is the change in the text
    });
  });
  return (
    <div>
      <div id="editor" ref={containerRef}></div>
    </div>
  );
});
