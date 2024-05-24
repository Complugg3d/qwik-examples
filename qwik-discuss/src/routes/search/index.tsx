import { component$ } from "@builder.io/qwik";

import { PostList } from "~/components/posts/post-list";

const Search = component$(() => {
  return <PostList />;
});

export default Search;
