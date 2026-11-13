# Lander

**Your AI agent builds your paid ads and their landing pages in chat.** You
get three page layouts. Every lead is saved with the ad it came from. You
see what the leads cost in a report.

[![Deploy on Task & Tool](https://taskandtool.com/images/deploy-button.svg)](https://taskandtool.com/accounts/register?starter_app=lander)

![Marlow Coaching's Facebook ad and the strategy call landing page it links to](https://taskandtool.com/images/starter-apps/lander.webp)

It's made to run on Task & Tool. There, each app has its own computer for
your AI agent. The project has a Postgres database for leads. The agent uses
the skills and scripts in this repo to write your offer, the pages and the
Facebook ads that point at them. It checks each one before you see it. The
pages are built with Hono and Tailwind.

## Get started

Click the button above, or pick Lander when you create an app on [Task &
Tool](https://taskandtool.com/starter-apps/lander). Then tell the agent
about your business and the offer you want to run ads for.

See it in use on the [Lander
page](https://taskandtool.com/starter-apps/lander).

## Features

### A stepped form, a full form or a page per campaign

The app starts with three page layouts. You can point different ads at each
one.

| Page | Layout |
|---|---|
| `/` | The form's first question in the top section. One question to a page after it |
| `/estimate` | The whole form lower on the page, and a button to it at the top |
| `/offer`, `/interior` | One per ad campaign: the stepped page with its own headline, line and photo |

Each page has a phone number and a rating at the top and no menu. On the
stepped pages, the first question is what the visitor wants. Each answer is
a card with a picture. Name, email and phone come last. The form works with
JavaScript off.

![Northline Gardens' fall cleanup lander: Get your garden cleared for winter from $90. The first question, What would you like done?, is in the top section](https://taskandtool.com/images/marketing/northline-gardens-lander-fall-cleanup.webp)

### The agent writes your ads

Ask for ideas and the agent works out angles from your brand notes and
research into competitors and what customers say. For ads, it makes a test
set: three ideas, each in three formats, for nine ads. Each ad is a folder
in `creatives/` with its copy, its pictures and the page it links to. The
agent writes that page's headline to repeat the ad's hook.

The agent starts from your own photos. It can also make a picture for an ad.
The agent lists each fact used in an ad in `claims.md` with its source.
Before you see a set, the agent checks each ad's text limits, its claims and
its landing page. Then it sends you each ad as it will look in the feed. It
works from sheets in `specs/` with the sizes and text limits for Meta,
Google, TikTok, LinkedIn, Pinterest and YouTube.

<p>
  <img src="https://taskandtool.com/images/marketing/marlow-ad-strategy-call.webp" width="300" alt="Marlow Coaching's Facebook ad for a free 30-minute strategy call">
  <img src="https://taskandtool.com/images/marketing/marlow-lander-phone.webp" width="300" alt="The strategy call lander it links to, at phone width">
</p>

### Every lead is saved with the ad it came from

When you post an ad in Ads Manager, give it its folder's name and the URL
parameters in `AGENTS.md`. Each lead is then saved with its campaign, ad set
and ad, its UTM tags and the click id from Facebook, Google, Microsoft or
TikTok. The form has a hidden field to catch bots.

You get an email about each new lead. Ask the agent to add your team's
addresses. The agent can also send new leads to your CRM, a webhook or
another email address. On the Settings page you see where leads go and how
many sent or failed in the last 30 days. If you add the [CRM Starter
App](https://github.com/taskandtool/crm) to the same project, you'll find
the leads there too.

### Cost per lead and sales by ad

Your team opens Reports at `/admin/reports` to see leads, ad cost, cost per
ad lead, appointments set, no-shows and sales. Pick the last 7, 30 or 90
days or a year, and compare each figure with the period before. You can
break the figures down by source, campaign, ad set or ad. Each row has its
revenue.

Connect your ad account and ask the agent to bring in ad costs each morning.
It sets up a scheduled job to save yesterday's spend, clicks and impressions
for each ad. When a lead becomes a customer, open the lead, mark it sold and
type in the amount. You then see the sale on the row for that lead's ad. If
you track leads in another CRM, the agent can set up a job to copy their
status from it each morning.

### A private admin page for leads

At `/admin` your team sees every lead and booking. From a lead you can
reschedule or cancel a booking and refund a payment. Appointments has the
week's schedule, the services people can book and the team who take them.
Only your team can open these pages, even once the landers are public.

### People can book a time or pay in the form

Visitors pick a time from your team's hours. Two people can't book the same
slot. Payments go through your own Stripe account.

### Checks on code, facts, copy, design and SEO

The agent runs `npm run check` before it shows you any work and fixes what
it finds. The check covers five areas:

| Check | What it catches |
|---|---|
| Code | Type errors, failing tests and a build that breaks |
| Facts | Notes that don't compile and proof missing from the page |
| Copy | Numbers and quotes that aren't in your notes, and wording that sounds like AI |
| Design | Low contrast, small text and pages that scroll sideways on a phone |
| SEO | Missing titles, descriptions and alt text, and broken links |

### Skills in this repo

A skill is a set of instructions the agent loads when a task needs it. This
repo has 16:

| Skill | What it does |
|---|---|
| `lander` | Writes a landing page, from the offer to the proof and the form |
| `ad-ideas` | Turns your brand and research into ranked ideas for ads |
| `ad` | Makes an ad to one platform's specs and checks it |
| `copywriting` | Writes an ad's hook and fits its words to the platform |
| `research` | Looks at competitors' sites and ads and at what customers say |
| `results` | Reads your ad and search numbers and writes a monthly report |
| `brand` | Gathers your business facts and your look from your site, files or chat |
| `writing` `tropes` | Write in the owner's voice and spot phrases that read as machine-written |
| `forms` `booking` `payments` `admin` `customers` `reports` `data` | Forms, bookings, Stripe payments, the admin page, customer records, the lead report and the database code they share |

## Why run it on Task & Tool

Task & Tool is the easiest place to run it. The database is included. The
agent publishes the landers to Cloudflare when you ask. Each app gets:

- Its own computer for the agent
- A dev address your team opens to see changes before they go live
- A Postgres database for leads, bookings and payments. You can roll it back
  to an earlier point in time.
- Publishing on your own domain with a free SSL certificate. Only your team
  sees production until you make it public.
- Connections to your ad account, Stripe, email and any service with an API.
  Task & Tool holds their keys.
- Scheduled jobs for the morning ad costs and CRM statuses above
- Sign-in for your team on the admin pages

## Make it your own

Ask the agent for any change in the chat. To start from your own copy, fork
this repo, change what you like, and start a new app from your fork on Task
& Tool. You can also copy its skills from `.claude/skills/` into another
repo.

The app starts as a made-up business, Example Auto Detailing, with
placeholder legal pages, address and reviews. The agent replaces them with
yours in `src/offer.ts` and `src/legal.ts`.

## What's in the repo

```
src/              the app: the landers, forms, admin pages and lead report
src/offer.ts      what the landers say: the offer, proof, campaigns and questions
creatives/        one folder per ad: its copy, pictures and landing page
claims.md         every fact an ad may state, with its source
research/         approved hooks, and the agent's research once it runs
specs/            each ad platform's sizes and text limits
brand/            notes on the brand: voice, audience, look and logo
public/           the fact notes the pages are written from
design/           the design system
styles/           the Tailwind theme, compiled from the design system
static/           images and other files served as they are
scripts/          the build, the checks, the ad checks and previews, forms and reports
test/             the tests
.claude/skills/   the 16 skills
AGENTS.md         what the agent reads first
.taskandtool/     setup for an install on Task & Tool
starter-app.json  what the app needs and its chat suggestions
```

## Commands

The agent runs these on the app's computer. On your own computer, `npm run
dev` needs Node 20 or later. The forms need a Postgres database in
`DATABASE_URL`, and `/admin` needs `ADMIN_DEV_USER` set to an email.

- `npm run dev` serves the landers and `/admin` on localhost:3000 and
  restarts on every change.
- `npm run check` runs the five checks, and `npm test` runs the tests.
- `node scripts/forms.mjs list` lists the forms and what came in.
- `node scripts/reports.mjs summary` prints the lead report's figures.
- `python3 scripts/check.py` checks the ads, and `python3 scripts/preview.py
  <folder>` shows one as it will look in the feed.
- `npm run deploy` builds the landers and publishes them to production. It
  works only on Task & Tool.

## Third-party tools

- [`tt-crawl`](https://github.com/taskandtool/crawler), our crawler, with
  headless Chrome for reading your current site.
- The stock photos are from Pexels.
- npm packages, MIT: `hono`, `@hono/node-server`,
  `@neondatabase/serverless`, `marked`, `tailwindcss` + `@tailwindcss/cli`,
  `esbuild`, `tsx`, `node-html-parser`, `pg`; `yaml` (ISC) and `typescript`
  (Apache-2.0).

## License

MIT. See `LICENSE`.
