import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import paths from "~/helpers/paths";
import { useTopicsList } from "~/routes";

export const TopicsList = component$(() => {
  const topicsListSignal = useTopicsList();

  const renderedTopics = topicsListSignal.value.map((topic) => {
    return (
      <div key={topic.id}>
        <Link prefetch={false} href={paths.topicShow(topic.slug)}>
          <span class="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700 shadow-sm">
            {topic.slug}
          </span>
        </Link>
      </div>
    );
  });

  return <div class="flex flex-row flex-wrap gap-2">{renderedTopics}</div>;
});
