# Lander

A landing page for paid ads, on Hono: one page, one offer, one action. Every lead is saved first, with the ad it came
from, then sent on to the client's CRM if they have one. The team reads leads and a report at `/admin`.

It starts as a made-up business, Example Auto Detailing, with placeholder legal pages, address and reviews and stock photos from Pexels. To make it a real business's own, first read their site with the `brand` skill (`tt-crawl brand <url> --places` fills `brand/` and `public/`), then replace `src/offer.ts`, `src/legal.ts`, `static/images/lander/` and the colours and fonts in `design/system.yaml`, and the form's questions at the end of `src/offer.ts`. Never add a review or a figure the business did not give.

## Facebook ads

This one app makes the ads, sends people to the landers, saves the leads, sends them on and reports. Which skill, by the ask:

- "give me ideas", a campaign: `ad-ideas`; competitors, customers' words: `research`
- "write me ads", "a set to test": `ad`; its hook and lengths: `copywriting`; every word: `writing`, then `tropes`
- "how did the ads do": `results`, and the Reports page for leads and cost per lead

In Ads Manager, name the ad as its folder and set its URL parameters to `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}`. Meta fills in the names. Each lead then shows its campaign, ad set and ad. The report matches spend to leads by those names.

Each ad is a folder, `creatives/YYYY-MM-DD-<slug>/`: `creative.md`, its pictures (`v1.jpg`), and `landing:`, the lander page it goes to. A new angle with no page of its own gets a campaign in `src/offer.ts` first, its headline echoing the hook. Every fact an ad states is numbered in `claims.md`.

**Hooks are plain promises.** The offer or the outcome, the product, and the proof or the speed, in words a customer would say: "Get your car looking new again this week". Clever, cute or mysterious lines lose here. Approved lines and candidates are in `research/hooks.md`; start from them. Never imply you know someone's age, health or disability; talk about the product.

```bash
python3 scripts/check.py [folder …]   # the audit: limits, tropes, claims, landing page; one line per creative
python3 scripts/preview.py <folder> […] --send "one line for the owner"   # each ad as its feed shows it, as deliverables; without --send it only writes preview.html
python3 ~/tools/taskandtool.py make-image --prompt-file creatives/<folder>/creative.md --section Prompt --out creatives/<folder>/v1.jpg --size 4:5   # a picture; never replaces one
```

Pictures: start from the owner's real photos (`uploads/`, `static/images/`). Never a picture that passes off a made-up person as a customer or a made-up result as theirs. `creative.md`'s frontmatter is `kind: ad`, `platform: meta`, `format`, `angle`, `hook`, `awareness`, `status: draft`, `claims`, `files`, `landing`, `url` (the live ad, once posted) and `copy` (`headline`, `primary_text`, `description`, `cta`).

## The three landers

- `/`: **stepped.** The first question in the hero, then a focused page per question.
- `/estimate`: **button.** A button in the hero goes down to the whole form, lower on the page.
- `/offer`, `/interior`: **a headline per campaign.** A stepped page with its own headline, line and photo. Add one in `CAMPAIGNS`, and point each ad campaign at its own.

The pages are in `src/lander.tsx`. The forms are rows: `node scripts/forms.mjs show estimate`, `--help` for the rest.

## Commands

```bash
npm run dev                          # the site at localhost:3000, and /admin
node scripts/forms.mjs list          # the forms and what came in; show, save, submissions, destination-save
node scripts/reports.mjs summary     # the lead report's figures; spend saves ad costs, outcome a lead's status
npm run check                        # before showing work
npm test
npm run deploy
```

## Skills

- `lander`: writing one, from the offer to the proof. Read it before changing the page.
- `forms`: questions, answer cards, steps, sending leads to a CRM or webhook.
- `reports`: the lead report; `references/daily-numbers.md` for the morning job that brings in ad costs and a client CRM's statuses.
- `booking`, `payments`: a calendar or a payment as a step of the form. `customers`, `admin`, `data`, `brand`, `writing`, `tropes`.

## Rules

- A phone number and a rating at the top of every page. No menu: nothing to wander off to.
- The form works with JavaScript off.
- Colours, fonts and sizes are tokens: change `design/system.yaml`, then `npm run apply-design`.
- Clients seeing only their report isn't built yet. `/admin` is for the team.
