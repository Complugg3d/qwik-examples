import { component$} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import style from "./header.module.css";

export default component$(function Header() {
  return (
    <nav class={style.header}>
      <Link class={`${style.link} ${style.home}`} href="/">
        Home
      </Link>
      <div class={style.options}>
        <Link class={style.link} href="/performance">
          Performance
        </Link>
        <Link class={style.link} href="/scale">
          Scale
        </Link>
        <Link class={style.link} href="/reliability">
          Reliability
        </Link>
      </div>
    </nav>
  );
});
