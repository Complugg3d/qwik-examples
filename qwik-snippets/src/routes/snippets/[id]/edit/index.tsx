import {
  component$,
  useStore,
  useSignal,
  noSerialize,
  useVisibleTask$,
  type NoSerialize,
} from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";
import * as MonacoE from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { db } from "~/db/db";

export const useReadSnippet = routeLoader$(async (request) => {
  const { id } = request.params;
  const snippet = await db.snippet.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!snippet) {
    return request.fail(404, { message: "Snippet not found" });
  }

  request.cacheControl({ noCache: true });

  return snippet;
});

export const useEditSnippet = routeAction$(
  async (form, request) => {
    const prisma = new PrismaClient();
    const snippet = await prisma.snippet.update({
      where: {
        id: +form.id,
      },
      data: {
        code: form.code.toString(),
      },
    });
    if (snippet.code) {
      request.redirect(308, `/snippets/${snippet.id}?updated=true`);
    } else {
      return request.fail(400, { message: "Missing code" });
    }
  },
  zod$({
    id: z.string(),
    title: z.string(),
    code: z.string(),
  }),
);

export default component$(() => {
  const snippet = useReadSnippet();
  const editSignal = useSignal(snippet.value.code || "");
  const editorRef = useSignal<HTMLElement>();
  const editAction = useEditSnippet();
  const store = useStore<{
    monacoInstance: NoSerialize<MonacoE.editor.IStandaloneCodeEditor>;
  }>({
    monacoInstance: undefined,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    self.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === "json") {
          return new jsonWorker();
        }
        if (label === "css" || label === "scss" || label === "less") {
          return new cssWorker();
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return new htmlWorker();
        }
        if (label === "typescript" || label === "javascript") {
          return new tsWorker();
        }
        return new editorWorker();
      },
    };

    const editor = MonacoE.editor.create(editorRef.value!, {
      value: "",
      theme: "vs-dark",
      language: "javascript",
    });

    // Monaco is not serializable, so we can't serialize it as part of SSR
    // We can however instantiate it on the client after the component is visible
    store.monacoInstance = noSerialize(editor);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => snippet.value);
    track(() => store.monacoInstance);

    if (snippet.value.code && store.monacoInstance) {
      store.monacoInstance.setValue(snippet.value.code);
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    store.monacoInstance?.onDidChangeModelContent(() => {
      const newValue = store.monacoInstance?.getValue();

      editSignal.value = newValue || "";
    });
  });

  return (
    <>
      <div
        style={{
          height: "40vh",
        }}
        ref={editorRef}
      ></div>
      <Form action={editAction}>
        <input
          type="hidden"
          id="title"
          name="title"
          value={snippet.value?.title}
        />
        <input type="hidden" id="code" name="code" value={editSignal.value} />
        <input type="hidden" id="id" name="id" value={snippet.value?.id} />
        <button type="submit" class="rounded border p-2">
          Save
        </button>
      </Form>
    </>
  );
});
