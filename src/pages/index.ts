// Pre-rendered pages, if a lander needs any (a thank-you, a policy). The lander itself is in src/business.tsx: its
// form is stamped per visit, so it cannot be a file. The pages of the site, in nav order. Each module exports one object,
// `export const Name = { page, Body }`: `page` (route, title, description)
// and `Body` (the <main> content). Add a page: create src/pages/<name>.tsx
// in that shape and add it to `modules` here; it becomes a route on the
// machine and a pre-rendered HTML file when deployed.
import type { FC } from "hono/jsx";
import type { Page } from "../site";

interface PageModule {
  page: Page;
  Body: FC;
}

const modules: PageModule[] = [];

export const pages: (Page & { Body: FC })[] = modules.map((m) => ({ ...m.page, Body: m.Body }));
