const paths = {
  home() {
    return "/";
  },
  topicShow(slug: string) {
    return `/topics/${slug}`;
  },
  postCreate(slug: string) {
    return `/topics/${slug}/posts/new`;
  },
  postShow(slug: string, id: string) {
    return `/topics/${slug}/posts/${id}`;
  },
};

export default paths;
