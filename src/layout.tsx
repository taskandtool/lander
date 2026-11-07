// The document around every page: head, header, footer. `bare` leaves the header and footer out, for
// a page that draws its own. Name and contact details come from src/site.ts; the
// fonts from src/fonts.ts (generated from design/system.yaml).
import { html, raw } from "hono/html";
import type { Child } from "hono/jsx";
import { googleFontsUrl } from "./fonts";
import { ORIGIN_SCRIPT } from "./forms/origin";
import { LanderFooter, LanderHeader } from "./lander";
import { site, pageTitle, canonicalUrl, type Page } from "./site";

export function Layout({ page, bare, children }: { page: Page; bare?: boolean; children?: Child }) {
  return (
    <html lang={site.locale || "en"} class="scroll-smooth">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle(page)}</title>
        <meta name="description" content={page.description} />
        <meta property="og:title" content={pageTitle(page)} />
        <meta property="og:description" content={page.description} />
        <meta property="og:type" content="website" />
        {googleFontsUrl ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        ) : null}
        <link rel="stylesheet" href="/site.css" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {page.canonical !== false && canonicalUrl(page.path) ? <link rel="canonical" href={canonicalUrl(page.path)!} /> : null}
        {(page.jsonLd ?? []).map((obj) => (
          <script type="application/ld+json">{raw(JSON.stringify(obj))}</script>
        ))}
        {site.cart ? <script src="/cart.js" defer /> : null}
        <script>{raw(ORIGIN_SCRIPT)}</script>
        <Tracking />
      </head>
      <body class="flex min-h-screen flex-col bg-canvas text-ink font-body">
        <a
          href="#main"
          class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to content
        </a>
        <Notice />
        {bare ? null : <LanderHeader />}
        <main id="main" class="flex-1">{children}</main>
        {bare ? null : <LanderFooter />}
      </body>
    </html>
  );
}

// Analytics and verification carried over from the old site (src/site.ts,
// `tracking`). Nothing renders when the IDs are empty.
function Tracking() {
  const t = site.tracking;
  const id = (v: string) => /^[A-Za-z0-9_-]+$/.test(v) ? v : "";
  return (
    <>
      {id(t.searchConsole) ? <meta name="google-site-verification" content={id(t.searchConsole)} /> : null}
      {id(t.ga4) ? (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${id(t.ga4)}`}></script>
          <script>{raw(`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id(t.ga4)}');`)}</script>
        </>
      ) : null}
      {id(t.metaPixel) ? (
        <script>{raw(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id(t.metaPixel)}');fbq('track','PageView');`)}</script>
      ) : null}
    </>
  );
}

/** The business note's notice, gone after its last day: at build, and in the browser for a page built before then. */
function Notice() {
  const { text, until } = site.notice;
  if (!text || (until && until < new Date().toISOString().slice(0, 10))) return null;
  return (
    <>
      <p class="bg-accent px-5 py-2 text-center text-accent-ink" data-until={until || undefined}>{text}</p>
      {until ? <script>{raw(`document.querySelectorAll("[data-until]").forEach(function(e){if(new Date(e.dataset.until+"T23:59:59")<new Date())e.remove()})`)}</script> : null}
    </>
  );
}

/** A full document for a page: the doctype plus the layout. */
export function render(page: Page, body: Child, o: { bare?: boolean } = {}) {
  return html`<!doctype html>${raw(String(<Layout page={page} bare={o.bare}>{body}</Layout>))}`;
}
