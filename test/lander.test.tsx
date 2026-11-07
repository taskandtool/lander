// The landers' own: every page answers with no database, and the forms are ones the forms skill accepts.
import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app";
import { checkFields } from "../src/forms/fields";
import { BUTTON, CAMPAIGNS, FORMS, offer, STEPPED } from "../src/offer";

test("each lander and campaign page shows its own headline, a phone number and no menu, with no database yet", async () => {
  for (const c of [STEPPED, BUTTON, ...CAMPAIGNS]) {
    const res = await app.request(c.path);
    assert.equal(res.status, 200, c.path);
    const html = await res.text();
    assert.ok(html.includes(c.headline.accent), `${c.path} says its headline`);
    assert.ok(html.includes(offer.phoneHref), `${c.path} can be called`);
    assert.doesNotMatch(html, /<nav/, `${c.path} has nothing to wander off to`);
  }
});

test("a button page's button goes to its form, lower down the page", async () => {
  const html = await (await app.request(BUTTON.path)).text();
  assert.match(html, /href="#quote"/);
  assert.ok(html.indexOf('id="quote"') > html.indexOf(offer.beforeAfterTitle), "the form comes after the proof");
});

test("the forms are valid, with contact details last in the stepped one", () => {
  for (const f of FORMS) assert.deepEqual(checkFields(f.fields).problems, {}, f.key);
  const stepped = checkFields(FORMS[0].fields).fields;
  assert.equal(stepped[stepped.length - 1].type, "tel");
  assert.equal(stepped.find((x) => x.name === "project")?.cards, true);
});

test("each service picks an answer the first question has", () => {
  for (const f of FORMS) {
    const options = checkFields(f.fields).fields.find((x) => x.name === "project")?.options ?? [];
    for (const s of offer.services) assert.ok(options.includes(s.answer), `${f.key}: ${s.answer}`);
  }
});

test("both forms ask for texting consent, which is never ticked or required", () => {
  for (const f of FORMS) assert.equal(f.follow_up, true, f.key);
  assert.match(offer.textConsent, /not required to give this authorization/);
});
