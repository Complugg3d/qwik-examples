import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import EasyMDE from "easymde";

export const EasyMDETest = component$(() => {
  const easeMDERef = useSignal<HTMLTextAreaElement>();
  const innerHTMLEasyMDE = useSignal("");

  useVisibleTask$(() => {
    new EasyMDE(easeMDERef.value).codemirror.on("change", (event) => {
      console.log("emgv Change", event);
    });
  });
  return (
    <>
      <div>{easeMDERef.value?.innerHTML}</div>
      <h1>Hi 👋</h1>
      <textarea
        ref={easeMDERef}
        onChange$={(event, element) => {
          innerHTMLEasyMDE.value = element.value;
        }}
      />
    </>
  );
});
