// The lander's two pages, and what it takes from visitors and shows the team: forms (a question at a time, or all
// at once; a booking and a payment can be steps too), the booking pages at /book, Stripe's webhook, and the private
// /admin: every lead with where it came from and where it got to, and the lead report. Every one reads the project's
// database (DATABASE_URL: a Worker binding in production, the env in dev).
//
// The code under src/data, admin, forms, booking, payments, customers and reports is the skills' (each skill's
// SKILL.md says how to use it); this file only mounts it.
import { Hono, type Context, type MiddlewareHandler } from "hono";
import type { Child } from "hono/jsx";
import { teamOnly, type TeamVars } from "./admin/guard";
import { sidebarFrame, type NavItem } from "./admin/layout";
import { bookingAdmin, peopleRoutes, typeRoutes } from "./booking/admin";
import { confirmFormBooking } from "./booking/confirm";
import { bookingStep } from "./booking/form-step";
import { emailSend, emailSender, notifyBooking, type BookingNotice } from "./booking/notify";
import { bookingPages } from "./booking/public";
import { envOf, envVar } from "./data/env";
import type { Db } from "./data/db";
import { fromNeon } from "./data/neon";
import { pushAfterWrites } from "./booking/sync";
import { afterResponse, sendEmail } from "./data/send";
import { formsAdmin, teamEmailState } from "./forms/admin";
import { destinationsOf, leadMoment } from "./forms/destinations";
import { ORIGIN_KEYS } from "./forms/origin";
import { formRoutes } from "./forms/routes";
import { BOOKING_PAGE, completePaidSubmission, recordNotified } from "./forms/store";
import { formatSlot } from "./booking/slots";
import { Layout, render } from "./layout";
import { paymentsAdmin } from "./payments/admin";
import { paymentStep } from "./payments/form-step";
import { stripeConnected, stripeFrom } from "./payments/stripe";
import { stripeWebhook } from "./payments/webhook";
import { embedForm } from "./forms/routes";
import { Section } from "./admin/detail";
import { ButtonPage, FocusPage, LegalDoc, StepPage, ThanksPage } from "./lander";
import { LEGAL } from "./legal";
import { BUTTON, CAMPAIGNS, offer, STEPPED, type Campaign } from "./offer";
import { LeadReportBody, loadLeadReport, ReportPeriods, reportQuery } from "./reports/leads";
import { addDays as addReportDays, todayIn as reportToday } from "./reports/sql";
import { site } from "./site";
import { unsubscribeRoutes } from "./data/unsubscribe";
import { textingBox } from "./forms/consent";

/** This app's slug, stored on every row it writes. */
const SOURCE = "lander";
const CSS = "/site.css";

const hasDb = (c: Context) => !!envVar(c, "DATABASE_URL");
const getDb = (c: Context) => fromNeon(envVar(c, "DATABASE_URL"));
/** The domain in a calendar invite's UID, one for every invite so a booking is one event: the site's address once set. */
const DOMAIN = site.url ? new URL(site.url).host : "localhost";
/** The booker's confirmation with its calendar invite, through the owner's sender, after the response. */
const confirm = (c: Context, e: BookingNotice) => afterResponse(c, notifyBooking(emailSend(envOf(c)), e, { domain: DOMAIN }));
/** The booking pages' address for a manage link: the site's own once set, else this request's host (a visitor's). */
const BOOK = site.url ? `${site.url.replace(/\/$/, "")}/book` : null;

/** A submission's page on the team's side, for the emails about it. */
const submissionLink = (c: Context, id: string) => new URL(`/admin/leads/${id}`, c.req.url).href;
/** A finished submission goes to its destinations, after the response. */
const sendLead = (c: Context, db: Db, id: string) => afterResponse(c, leadMoment(db, envOf(c), id, "complete", { link: submissionLink(c, id) }));

/**
 * A booking made at /book, or by the team on the Schedule, is a submission
 * too, so the team reads every booking where it reads every form. Once per
 * booking: one that already belongs to a submission (a form's booking step)
 * is left alone. `page` is where it was made; null for the team's. The new
 * submission's id, or null when there was none to make.
 */
export async function bookingSubmission(db: Db, e: Pick<BookingNotice, "booking" | "type" | "host">, page: string | null): Promise<string | null> {
  const b = e.booking;
  const notes = typeof b.answers.notes === "string" ? b.answers.notes : undefined;
  const origin = Object.fromEntries(ORIGIN_KEYS.flatMap((k) => (b.answers[k] ? [[k, b.answers[k]]] : [])));
  const data = JSON.stringify({ service: e.type.name, with: e.host.name, ...(notes ? { notes } : {}), ...origin });
  const [made] = await db.sql<{ id: string }>`
    with made as (
      insert into submissions (form_key, name, email, phone, data, source, page, status, completed_at, text_consent, text_consent_at)
      select ${BOOKING_PAGE.key}, ${b.name}, ${b.email}, ${b.phone}, ${data}::jsonb, ${SOURCE}, ${page}, 'new', now(), k.text_consent, k.text_consent_at
      from bookings k where k.id = ${b.id}::bigint and k.submission_id is null
      returning id)
    update bookings set submission_id = made.id from made where bookings.id = ${b.id}::bigint
    returning made.id::text as id`;
  return made?.id ?? null;
}

/**
 * Whoever takes a booking made at /book hears of it (team mail: Task & Tool
 * email reaches them when they can open this site in Task & Tool), and the
 * submission keeps who it reached. The team's own bookings tell nobody.
 */
async function tellHost(c: Context, db: Db, id: string, e: BookingNotice): Promise<void> {
  const b = e.booking;
  const to = [e.host.email!];
  const when = formatSlot({ start: b.starts_at, end: b.ends_at }, e.host.time_zone || site.timeZone);
  const sent = await sendEmail(envOf(c), {
    to,
    subject: `New booking: ${e.type.name} with ${b.name || b.email}`,
    text: `${b.name || b.email} booked ${e.type.name} with ${e.host.name}.\n\n${when}\n\n${submissionLink(c, id)}`,
    replyTo: b.email,
    team: true,
  });
  await recordNotified(db, id, to, sent);
}

/**
 * Every change is told to the booker; a new booking is filed with the
 * submissions too (`page` is where it was made). Told first, so a filing
 * that fails (the caller logs it) never stops the confirmation; the booking
 * stands either way. A booking made at /book tells its host (`tellHost`).
 * `dbOf` is the project's database unless a test gives its own.
 */
export const filed = (page: (e: BookingNotice) => string | null, dbOf: (c: Context) => Db = getDb) => async (c: Context, e: BookingNotice) => {
  confirm(c, e);
  if (e.event !== "booked") return;
  const db = dbOf(c);
  const where = page(e);
  const id = await bookingSubmission(db, e, where);
  if (id && where && e.host.email) afterResponse(c, tellHost(c, db, id, e));
  // Booked online by the booker: a lead like any form's, sent wherever those go.
  if (id && where) sendLead(c, db, id);
};

/** No database yet: these paths do not exist. */
const needsDb: MiddlewareHandler = async (c, next) => (hasDb(c) ? next() : c.notFound());

// Texts are the CRM's: a form or a booking here writes its row, and the
// CRM's job finds it and texts (or emails) within 15 minutes. This site only
// shows the texting box, once the project has a business number (the
// CRM's) and the business's name (forms/consent.ts).
const consentHere = (about: "request" | "booking") => (c: Context) => textingBox(getDb(c), about);

/** A form's or a booking's page in the site's own layout. */
const Shell = ({ children }: { children?: Child }) => <section class="mx-auto max-w-xl px-4 py-12">{children}</section>;
const page = (path: string, title: string, body: Child) => render({ path, title, description: title }, <Shell>{body}</Shell>);

const business = new Hono();

// A booking any write here changed reaches its calendar after the response,
// when the owner has granted this site the calendar's connection; otherwise
// the CRM's calendar sync takes it (booking/jobs.ts).
business.use("*", pushAfterWrites((c) => (hasDb(c) ? { db: getDb(c) } : null)));

// Stripe's events: the only thing that marks a payment paid. Each app that
// takes payments has its own endpoint (stripe_events dedupes an event two
// apps both receive). Stripe reaches dev at `taskandtool.py inbound-url /hooks/stripe` and
// production at this site's address; the payments skill's setup says how.
// A form that ends in payment is complete once it is paid, and its booking
// is confirmed then (Stripe delivers again if the send fails).
business.post("/hooks/stripe", async (c, next) => (hasDb(c) ? next() : c.text("waiting for the database", 503)));
business.route(
  "/",
  stripeWebhook(getDb, {
    afterPaid: async (c, paymentId) => {
      const id = await completePaidSubmission(getDb(c), paymentId);
      if (!id) return;
      // Ahead of the confirmation, whose failure makes Stripe deliver again.
      sendLead(c, getDb(c), id);
      const sent = await confirmFormBooking(getDb(c), id, emailSender(envOf(c)), { domain: DOMAIN, manageBase: BOOK });
      if (sent.status === "failed") throw new Error(`booking confirmation for submission ${id}: ${sent.error}`);
    },
  }),
);

// A follow-up email's unsubscribe link (the CRM's job sends the emails, with links on this site).
business.use("/unsubscribe", needsDb);
business.route("/", unsubscribeRoutes(getDb, { page: async (c, title, body) => String(await page(c.req.path, title, body)) }));

// Forms, with the booking and payment steps a form may have.
business.use("/forms/*", needsDb);
const lander = (c: Campaign, Page: typeof StepPage, key: string) => business.get(c.path, async (ctx) => {
  const form = hasDb(ctx) ? await embedForm(ctx, getDb(ctx), key, { textConsent: offer.textConsent }).catch((e) => (console.error("lander form:", e), null)) : null;
  ctx.header("Cache-Control", "no-store");
  return ctx.html(render({ path: c.path, title: offer.business, description: c.lede }, <Page c={c} form={form} />));
});
lander(STEPPED, StepPage, offer.forms.stepped);
lander(BUTTON, ButtonPage, offer.forms.allAtOnce);
for (const c of CAMPAIGNS) lander(c, StepPage, offer.forms.stepped);

business.get(offer.privacy, (c) => c.html(render({ path: offer.privacy, title: LEGAL.privacy.title, description: `How ${offer.business} handles your information.` }, <LegalDoc doc={LEGAL.privacy} />)));
business.get(offer.terms, (c) => c.html(render({ path: offer.terms, title: LEGAL.terms.title, description: `The terms of ${offer.business}'s text messages.` }, <LegalDoc doc={LEGAL.terms} />)));

business.route(
  "/",
  formRoutes(getDb, {
    source: SOURCE,
    // A step is a page of its own with nothing to wander off to.
    page: async (c, title, body) => String(await render({ path: c.req.path, title, description: title, canonical: false }, c.req.path.endsWith("/thanks") ? <ThanksPage>{body}</ThanksPage> : <FocusPage>{body}</FocusPage>, { bare: true })),
    // Answering the first question on the lander can be one quick click.
    minFillMs: 1000,
    adminPath: "/admin/leads",
    steps: {
      booking: bookingStep(getDb, { source: SOURCE, domain: DOMAIN }),
      payment: paymentStep(getDb, (c) => stripeFrom(envOf(c)), { source: SOURCE, connected: (c) => stripeConnected(envOf(c)) }),
    },
    // A booking in a form is confirmed when the whole form is done.
    onComplete: (c, id) => {
      afterResponse(c, confirmFormBooking(getDb(c), id, emailSender(envOf(c)), { domain: DOMAIN, manageBase: BOOK ?? new URL("/book", c.req.url).href }));
    },
    textConsent: () => offer.textConsent,
  }),
);

// Booking on its own: /book lists what can be booked, /book/<slug> books it.
business.use("/book", needsDb);
business.use("/book/*", needsDb);
business.route(
  "/book",
  bookingPages(getDb, {
    base: "/book",
    domain: DOMAIN,
    css: CSS,
    source: SOURCE,
    Page: ({ title, path, children }) => (
      <Layout page={{ path: path ?? "/book", canonical: path !== null, title, description: title }}>
        <Shell>{children}</Shell>
      </Layout>
    ),
    onBooked: filed((ev) => `/book/${ev.type.slug}`),
    textConsent: consentHere("booking"),
  }),
);

// The team's side, private: Task & Tool lets only the team reach /admin (add-private-path, which setup.sh declares) and
// teamOnly answers 404 to anyone else. In a sidebar: Leads (every form and booking, a booking rescheduled or cancelled and
// a payment refunded from its lead), Reports, Appointments (the week's Schedule, the Services people can book, the Team
// who take them) and Settings (where leads go, who is emailed).
const sections = { schedule: "/admin/schedule", services: "/admin/services", team: "/admin/team" };
const LEADS = "/admin/leads";
const appointments: NavItem[] = [
  { href: sections.schedule, label: "Schedule" },
  { href: sections.services, label: "Services" },
  { href: sections.team, label: "Team" },
];
const AdminFrame = sidebarFrame({
  brand: offer.business, logo: offer.logo || undefined, css: CSS,
  items: [
    { href: LEADS, label: "Leads", icon: "leads", under: [LEADS, "/admin/payments"] },
    { href: "/admin/reports", label: "Reports", icon: "reports" },
    { href: sections.schedule, label: "Appointments", icon: "appointments", under: Object.values(sections) },
    { href: "/", label: "View site", icon: "site" },
  ],
  foot: [{ href: "/admin/settings", label: "Settings", icon: "settings" }],
});
const toLead = (id: string | null) => (id ? { href: `${LEADS}/${id}`, label: "Back to the lead" } : null);
const admin = new Hono<{ Variables: TeamVars }>();
admin.use("*", teamOnly());
admin.onError((e, c) => {
  console.error(`${c.req.method} ${c.req.path}:`, e);
  const retry = c.req.method === "GET" ? c.req.url : null;
  return c.html(
    AdminFrame({
      title: "This page did not load", current: "", user: c.get("user"),
      children: <>
        <p>Please try again in a moment.</p>
        {retry ? <p class="mt-4"><a href={retry} class="font-semibold text-accent underline">Try again</a></p> : null}
      </>,
    }),
    500,
  );
});
admin.use("*", async (c, next) =>
  hasDb(c)
    ? next()
    : c.html(
        AdminFrame({
          title: "Leads", current: LEADS, user: c.get("user"),
          children: <p class="max-w-prose">This lander has no database yet. Its forms are off until it has one.</p>,
        }),
        503,
      ),
);
admin.get("/", (c) => c.redirect(LEADS));
admin.get("/reports", async (c) => {
  const { days, by, filter } = reportQuery((k) => c.req.query(k));
  const last = reportToday(site.timeZone);
  const report = await loadLeadReport(getDb(c), { period: { from: addReportDays(last, 1 - days), to: last }, zone: site.timeZone, currency: offer.currency, filter });
  return c.html(
    AdminFrame({
      title: "Reports", current: "/admin/reports", user: c.get("user"),
      actions: <ReportPeriods base="/admin/reports" days={days} by={by} filter={filter} />,
      children: <LeadReportBody report={report} base="/admin/reports" scripts="/reports.js" days={days} by={by} termLabel="Ad set" setupNotes={false} />,
    }),
  );
});
admin.get("/settings", async (c) => {
  const db = getDb(c);
  const [destinations, email, sends] = await Promise.all([
    destinationsOf(db),
    teamEmailState(c, db),
    db.sql<{ destination_id: string; sent: number; failed: number }>`
      select destination_id, count(*) filter (where status = 'sent')::int as sent, count(*) filter (where status = 'failed')::int as failed
      from lead_deliveries where created_at >= now() - interval '30 days' group by destination_id`,
  ]);
  const counted = new Map(sends.map((r) => [String(r.destination_id), r]));
  return c.html(AdminFrame({ title: "Settings", current: "/admin/settings", user: c.get("user"), children: (
    <div class="grid max-w-2xl gap-4">
      <Section title="Where leads go">
        {destinations.length ? (
          <ul class="grid gap-2">
            {destinations.map((d) => {
              const n = counted.get(String(d.id));
              return <li class="flex flex-wrap justify-between gap-x-4"><span class="font-semibold">{d.title}</span> <span class="text-ink-2">{n?.sent ?? 0} sent, {n?.failed ?? 0} failed in the last 30 days</span></li>;
            })}
          </ul>
        ) : <p class="text-ink-2">Leads are saved here only.</p>}
      </Section>
      <Section title="Email about new leads">
        <p class="text-ink-2">{!email.on ? "Off. Nobody is emailed about new leads." : email.to.length ? `On, to ${email.to.join(", ")}.` : "On, but nobody is on the list."}</p>
      </Section>
    </div>
  ) }));
});
// Calendar sync and reminders are scheduled jobs the CRM runs; this site has none.
const team = { css: CSS, source: SOURCE, Frame: AdminFrame, nav: appointments, timeZone: site.timeZone, sections, manageBase: BOOK ?? undefined, calendars: false };
admin.route(
  "/schedule",
  bookingAdmin(getDb, {
    ...team, base: sections.schedule,
    onBooked: filed(() => null),
    returnTo: (b) => toLead(b.submission_id),
  }),
);
admin.route("/services", typeRoutes(getDb, { ...team, base: sections.services }));
admin.route("/team", peopleRoutes(getDb, { ...team, base: sections.team }));
// A payment opens from its lead; the list is not in the nav, and one
// paid for anything else (a booking's deposit) refunds from its own page.
admin.route(
  "/payments",
  paymentsAdmin(getDb, {
    base: "/admin/payments", css: CSS, timeZone: site.timeZone, Frame: AdminFrame, nav: [],
    returnTo: (p) => toLead(p.ref_type === "submission" ? p.ref_id : null),
  }),
);
admin.route(
  "/leads",
  formsAdmin(getDb, {
    base: LEADS, css: CSS, timeZone: site.timeZone, Frame: AdminFrame, nav: [], outcomes: true, termLabel: "Ad set", label: "Leads", setupNotes: false, utmFields: true, noteDates: false,
    links: { booking: (id) => `/admin/schedule/${id}`, payment: (id) => `/admin/payments/${id}` },
  }),
);
business.route("/admin", admin);

export default business;
