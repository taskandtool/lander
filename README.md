# Lander

A landing page for paid ads on Hono and Tailwind, deployed to Cloudflare. Three styles: a stepped form that asks its first
question in the hero, a button down to the whole form, and a page per campaign with its own headline. Leads save to Postgres with
their UTM tags, go on to a CRM or webhook, and show in a report with cost per lead.

It starts as a made-up car detailer with placeholder legal pages and reviews, for a business to replace in `src/offer.ts` and `src/legal.ts`. The stock photos are from Pexels.

```bash
npm install && DATABASE_URL=... npm run dev
```

MIT.
