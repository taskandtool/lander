---
name: lander
description: "Writes and changes a landing page for paid ads: the offer, headline, proof and form, in src/offer.ts and src/lander.tsx. Use when asked to change what the lander says or how it is laid out, or to make it a real business's."
---

# Lander

Each lander is for one ad and has one action. Before writing, get the offer, the real proof and the phone number from
the owner or their site. Run the words through the `writing` skill. Change `src/offer.ts` for words and pictures,
`src/lander.tsx` for layout.

## The first screen

On a phone and a laptop, without scrolling: the rating, the headline, what they get, and the first question or the form.

- **Headline:** what they get, in the words of the ad they clicked. One plain sentence with one accent phrase.
- **Rating:** the real score and count, from where they can check it.
- **Checks:** four at most, each something they'd otherwise worry about. Put the guarantee last.
- **Picture or video:** the real business doing the work, if the owner has it. Stock only until then.
- **Phone number:** always in the header. Some people will only call.

## The form

- First question: easy and about their thing, with icon cards. Never name or phone first.
- One question a page, in the order a person would ask. Contact details last, saying why you need them.
- Four or five steps is plenty. Each question has to change what you'd quote or who you'd send.
- Only ask for what the team uses. All-at-once forms: five or six fields at most.

## Below the first screen

In this order unless the offer says otherwise: reviews, photos of the work, prices, the guarantee, FAQ, and a footer with the areas served and the privacy and terms pages. End
each section with a button to `#quote`. Cut a section with nothing real to say.

## Proof

Use every real review, rating, badge and photo there is, and never invent one.

## After launch

- Name each ad as its folder in Marketing, with `utm_campaign={{campaign.name}}&utm_content={{ad.name}}`. The report matches leads to spend by these names.
- Sending leads on: `forms` skill. Ad costs and a client CRM's statuses each morning: `reports` skill's `references/daily-numbers.md`.
