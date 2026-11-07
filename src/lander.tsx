// The lander's parts and pages. StepPage asks the first question in the hero and moves on to a focused page per
// question. ButtonPage has a button in the hero that goes down to the whole form, lower on the page. Each campaign's
// page is a StepPage with its own headline. Words and pictures come from src/offer.ts.
import type { Child } from "hono/jsx";
import { offer, type Campaign } from "./offer";
import type { LegalPage } from "./legal";

const wrap = "mx-auto max-w-wide px-5 sm:px-8";
const cta = "inline-flex min-h-14 items-center justify-center rounded-control bg-gold px-8 font-display text-2xl font-semibold uppercase text-ink no-underline transition-transform hover:-translate-y-0.5";
/** A ticket: punched notches on both sides and a thin line just inside the edge. */
const ticket = "relative [mask:radial-gradient(circle_0.7rem_at_0_50%,transparent_97%,#000)_left/51%_100%_no-repeat,radial-gradient(circle_0.7rem_at_100%_50%,transparent_97%,#000)_right/51%_100%_no-repeat] before:pointer-events-none before:absolute before:inset-1 before:rounded-sm before:border-[1.5px] before:border-current/55";
/** The hero's form is the one thing to do here: a gold frame with a light travelling round it, and an arrow down at its answers. */
const quoteFrame = "relative isolate overflow-hidden before:absolute before:top-1/2 before:left-1/2 before:-z-20 before:aspect-square before:w-[160%] before:-translate-x-1/2 before:-translate-y-1/2 before:animate-[travel_5s_linear_infinite] before:bg-[conic-gradient(transparent_0_72%,var(--color-surface)_88%,transparent_100%)] after:absolute after:inset-[5px] after:-z-10 after:rounded-sm after:bg-surface [&_legend]:after:ml-[0.3em] [&_legend]:after:inline-block [&_legend]:after:size-[0.95em] [&_legend]:after:animate-[nudge_1.6s_ease-in-out_infinite] [&_legend]:after:rounded-full [&_legend]:after:bg-gold [&_legend]:after:bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%3E%3Cpath%20fill=%27%230e1a26%27%20d=%27M9%203h6v9h5L12%2022%204%2012h5z%27/%3E%3C/svg%3E)] [&_legend]:after:bg-[length:70%] [&_legend]:after:bg-center [&_legend]:after:bg-no-repeat [&_legend]:after:align-[-0.12em]";
/** A light passing over the button every few seconds. */
const shine = "overflow-hidden after:pointer-events-none after:absolute after:inset-y-0 after:left-[-40%] after:w-[18%] after:-skew-x-[20deg] after:animate-[shine_4s_ease-in-out_infinite] after:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-surface)_75%,transparent),transparent)]";
/** A form step's controls, one row at the bottom of the card: a small chevron back on the left (the word stays for screen readers), the gold button on the right. */
const stepCard = "group/step relative [&_form>div:last-child]:min-h-14 [&_form>div:last-child]:flex-nowrap [&_form>div:last-child]:justify-between [&_form>div:last-child]:gap-3 [&_form>div:last-child>button[type=submit]:not([formnovalidate])]:w-auto [&_form>div:last-child>button[type=submit]:not([formnovalidate])]:flex-none [&_button[formnovalidate]]:-order-1 [&_button[formnovalidate]]:grid [&_button[formnovalidate]]:size-11 [&_button[formnovalidate]]:flex-none [&_button[formnovalidate]]:place-items-center [&_button[formnovalidate]]:text-[0px] [&_button[formnovalidate]]:text-ink-2 [&_button[formnovalidate]]:no-underline hover:[&_button[formnovalidate]]:text-ink [&_button[formnovalidate]]:before:size-6 [&_button[formnovalidate]]:before:bg-current [&_button[formnovalidate]]:before:[mask:url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%23000%27%20stroke-width=%272.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27M15%205l-7%207%207%207%27/%3E%3C/svg%3E)_center/contain_no-repeat]";
/** A step answered by clicking has no button of its own, so this stands in for one, in the same place. */
const stepNext = "group-not-has-[input[type=radio]]/step:hidden absolute right-4 bottom-6 sm:right-10 sm:bottom-10";
/** The forms' own controls, made to match: heavy borders, the gold button, and the progress bar without the count. */
const formLook = "[&_form]:max-w-none [&_label:has(:checked)]:bg-accent/5 [&_h2]:text-section [&_h2]:uppercase [&_[data-answers]_img]:h-16 lg:[&_[data-answers]_img]:h-20 [&_[data-answers]_span:has(>img)]:font-display [&_[data-answers]_span:has(>img)]:text-2xl lg:[&_[data-answers]_span:has(>img)]:text-3xl [&_[data-answers]_span:has(>img)]:uppercase [&_[data-answers]_span:has(>img)]:px-1 [&_div:has(>[role=progressbar])>p]:hidden [&_[role=progressbar]]:mt-0 [&_input]:border-2 [&_select]:border-2 [&_label:has(input[type=radio])]:border-2 [&_form_button[type=submit]:not([name])]:min-h-14 [&_form_button[type=submit]:not([name])]:bg-gold [&_form_button[type=submit]:not([name])]:font-display [&_form_button[type=submit]:not([name])]:text-2xl [&_form_button[type=submit]:not([name])]:font-semibold [&_form_button[type=submit]:not([name])]:uppercase [&_form_button[type=submit]:not([name])]:text-ink [&_legend]:text-section [&_legend]:uppercase";

const Check = ({ class: cls = "text-accent" }: { class?: string }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" class={"mt-0.5 size-5 shrink-0 " + cls} fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.81a.75.75 0 0 0-1.22-.88l-3.24 4.5-1.62-1.62a.75.75 0 1 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.09l3.75-5.22Z" />
  </svg>
);

export const Stars = ({ class: cls = "size-4", color = "text-gold" }: { class?: string; color?: string }) => (
  <span class={"inline-flex gap-0.5 " + color} aria-hidden="true">
    {[1, 2, 3, 4, 5].map(() => (
      <svg viewBox="0 0 20 20" class={cls} fill="currentColor"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9L4.7 18l1.1-6L1.4 7.8l6-.8L10 1.5Z" /></svg>
    ))}
  </span>
);

/** Google's mark, for reviews that are on Google. */
export const GoogleMark = ({ class: cls = "size-4" }: { class?: string }) => (
  <svg viewBox="0 0 48 48" role="img" aria-label="Google" class={"shrink-0 " + cls}>
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l8 6.2C12.5 13.7 17.800 9.500 24 9.500Z" />
    <path fill="#4285F4" d="M46.900 24.500c0-1.600-.1-3.100-.4-4.500H24v9h12.900c-.6 3-2.300 5.500-4.800 7.200l7.700 6c4.500-4.200 7.100-10.300 7.100-17.700Z" />
    <path fill="#FBBC05" d="M10.500 28.600A14.500 14.500 0 0 1 10.500 19.400l-8-6.200A24 24 0 0 0 2.600 34.800l7.900-6.200Z" />
    <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.800-5.800l-7.700-6c-2.100 1.400-4.900 2.300-8.100 2.300-6.200 0-11.500-4.200-13.400-9.800l-8 6.200C6.500 42.600 14.600 48 24 48Z" />
  </svg>
);

export const Rating = ({ class: cls = "" }: { class?: string }) => (
  <p class={"flex items-center gap-x-2 whitespace-nowrap text-base sm:text-copy " + cls}>
    {offer.rating.where === "Google" ? <GoogleMark /> : null}
    <Stars />
    <span class="font-semibold">{offer.rating.score}</span>
    <span class="opacity-80">({offer.rating.count})</span>
  </p>
);

const Ring = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mt-1 size-5 shrink-0 text-ink-3">
    <circle cx="10" cy="10" r="8" />
    <path d="m6.8 10.3 2.2 2.2 4.200-4.800" />
  </svg>
);

/** The promises as they sit under a form step: there, but not competing with it. */
const QuietChecks = ({ class: cls = "" }: { class?: string }) => (
  <ul class={"grid gap-2 " + cls}>
    {offer.checks.map((c) => <li class="flex gap-2.5 text-ink-2"><Ring /><span>{c}</span></li>)}
  </ul>
);

export const Checks = ({ class: cls = "", dark }: { class?: string; dark?: boolean }) => (
  <ul class={"grid gap-3 " + cls}>
    {offer.checks.map((c) => <li class={"flex gap-2.5 text-lg font-semibold " + (dark ? "text-night-ink" : "text-ink")}>{<Check class={dark ? "text-gold" : "text-accent"} />}<span>{c}</span></li>)}
  </ul>
);

/** The lander's header: the name, the rating and a phone number to call. No menu, nothing to wander off to. */
const PhoneIcon = ({ class: cls }: { class: string }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor" class={cls}><path d="M2 3.500A1.500 1.500 0 0 1 3.500 2h1.150a1.500 1.500 0 0 1 1.460 1.150l.66 2.640a1.500 1.500 0 0 1-.46 1.480l-1.020.87a10.500 10.500 0 0 0 5.560 5.560l.87-1.020a1.500 1.500 0 0 1 1.480-.46l2.640.66A1.500 1.500 0 0 1 18 14.350v1.150a2.500 2.500 0 0 1-2.500 2.500h-.5C7.820 18 2 12.180 2 5v-1.500Z" /></svg>
);

/** `quiet` is for the form's own steps, where the only loud thing should be the form. */
export function LanderHeader({ rating = true, quiet }: { rating?: boolean; quiet?: boolean }) {
  return (
    <>
    {quiet ? <p class="bg-gold px-3 py-2 text-center font-display text-lg font-semibold uppercase tracking-wide text-night sm:text-xl">{offer.claiming}</p> : (
    <div class="bg-gold px-3 py-2">
      <div class={ticket + " mx-auto flex w-fit max-w-full flex-col items-center gap-x-4 bg-accent px-5 py-1.5 text-center sm:px-7 font-display font-semibold uppercase text-surface lg:flex-row"}>
        <p class="whitespace-nowrap text-[clamp(1.25rem,6vw,1.5rem)] sm:text-3xl">{offer.coupon.offer}</p>
        <p class="whitespace-nowrap text-[clamp(0.85rem,4.2vw,1rem)] sm:text-xl">{offer.coupon.plus}</p>
      </div>
    </div>
    )}
    <header class="border-b border-line bg-surface">
      <div class={wrap + " flex min-h-16 items-center justify-between gap-3 py-2"}>
        <a href="/" class="flex min-w-0 items-center gap-3 no-underline">{offer.logo ? <img src={offer.logo} alt={offer.business} class="h-12 w-auto sm:h-14" /> : <span class="font-display text-2xl font-semibold uppercase text-ink">{offer.business}</span>}</a>
        <div class="flex items-center gap-5">
          {rating ? <Rating class="hidden lg:flex" /> : null}
          <a href={offer.phoneHref} class={quiet ? "inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold text-ink-2 no-underline hover:text-ink" : "inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-control bg-accent px-3 font-display text-xl font-semibold text-accent-ink no-underline hover:bg-accent-hover sm:px-5 sm:text-2xl"}>
            <PhoneIcon class={quiet ? "size-4" : "size-5"} />
            {offer.phone}
          </a>
        </div>
      </div>
    </header>
    </>
  );
}

const Headline = ({ c }: { c: Campaign }) => (
  <h1 class="font-display text-display uppercase text-night-ink">
    {c.headline.before} <span class="inline-block text-balance text-gold">{c.headline.accent}</span>{c.headline.after ? ` ${c.headline.after}` : ""}
  </h1>
);

/** The offer as a ticket, for further down the page; the top bar carries the same one, smaller. */
const Coupon = ({ class: cls = "" }: { class?: string }) => (
  <div class={ticket + " bg-accent px-8 py-6 text-center font-display font-semibold uppercase text-surface " + cls}>
    <p class="text-balance text-section sm:text-display">{offer.coupon.offer}</p>
    <p class="mt-2 text-xl sm:text-2xl">{offer.coupon.plus}</p>
  </div>
);

const SEAL_POINTS = Array.from({ length: 48 }, (_, i) => {
  const r = i % 2 ? 45 : 50;
  const a = (i * Math.PI) / 24;
  return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

/** The guarantee as a stamped seal. `dark` is for a gold background, where the gold seal would vanish. */
const GuaranteeSeal = ({ dark, class: cls = "" }: { dark?: boolean; class?: string }) => (
  <div class={"relative flex size-32 items-center justify-center text-center font-display font-semibold uppercase lg:size-40 " + (dark ? "text-gold " : "text-ink ") + cls}>
    <svg viewBox="0 0 100 100" aria-hidden="true" class="absolute inset-0 size-full">
      <polygon points={SEAL_POINTS} class={dark ? "fill-night" : "fill-gold"} />
      <circle cx="50" cy="50" r="40" fill="none" stroke-width="1" class={dark ? "stroke-gold" : "stroke-ink"} />
    </svg>
    <div class="relative">
      <Stars class="size-2.5 lg:size-3" color={dark ? "text-gold" : "text-ink"} />
      <span class="block text-2xl leading-none lg:text-3xl">{offer.guarantee.badge[0]}</span>
      <span class="-mx-5 mt-1 block rounded-sm bg-accent py-0.5 text-sm leading-tight text-surface lg:-mx-7 lg:text-base">{offer.guarantee.badge[1]}</span>
    </div>
  </div>
);

const HeroMedia = ({ c }: { c: Campaign }) => (
  <div class="relative">
    <img src={c.hero.image} alt={c.hero.alt} class="aspect-[4/3] w-full rounded-card border-4 border-surface object-cover" fetchpriority="high" />
    <GuaranteeSeal class="absolute! -bottom-4 -right-1 rotate-12 lg:-right-6" />
  </div>
);

/** A multiple-choice question starts on its first answer, so Next always has something to send. */
const FirstAnswer = () => (
  <script dangerouslySetInnerHTML={{ __html: "document.currentScript.parentElement.querySelectorAll('fieldset').forEach(function(f){var r=f.querySelectorAll('input[type=radio]');if(r.length&&!f.querySelector(':checked'))r[0].checked=true})" }} />
);

/**
 * Stepped: the headline on the left, the picture on the right, and the first question right under them, in
 * the first screen. On a phone the question comes before the picture.
 */
function StepHero({ c, form }: { c: Campaign; form: Child }) {
  return (
    <section class="bg-night">
      <div class={wrap + " grid gap-x-12 gap-y-6 py-7 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-y-5 lg:py-7"}>
        <div class="lg:self-center">
          <Rating class="mb-3 text-night-ink lg:hidden" />
          <Headline c={c} />
          <Checks dark class="mt-5 lg:mt-6 lg:gap-4 lg:[&_li]:text-2xl" />
        </div>
        <div class="order-2 lg:order-none"><HeroMedia c={c} /></div>
        <div id="quote" class={quoteFrame + " order-1 scroll-mt-6 rounded-card bg-gold p-5 lg:order-none lg:col-span-2 lg:p-6 [&_[data-answers]]:sm:grid-cols-4 " + formLook}>
          {form ?? <CallInstead />}
          {form ? <FirstAnswer /> : null}
          {form ? <button type="button" onclick="this.closest('#quote').querySelector('form').reportValidity()&&this.closest('#quote').querySelector('form').requestSubmit()" class={cta + " " + shine + " relative w-full min-h-18 text-4xl"}>Next</button> : null}
        </div>
      </div>
    </section>
  );
}

/** A button down to the form: the headline across the top, the promises beside the photo. */
function ButtonHero({ c }: { c: Campaign }) {
  return (
    <section class="bg-night text-night-ink">
      <div class={wrap + " py-9 sm:py-14"}>
        <div class="mx-auto max-w-4xl text-center"><Headline c={c} /></div>
        <div class="mt-9 grid items-center gap-x-14 gap-y-9 lg:grid-cols-2">
          <div>
            <p class="max-w-xl text-lede text-night-ink-2">{c.lede}</p>
            <Checks dark class="mt-6" />
            <div class="mt-7 flex flex-wrap items-center gap-4"><a href="#quote" class={cta}>Get my free estimate</a> <a href={offer.phoneHref} class="font-display text-2xl font-semibold text-night-ink no-underline hover:text-gold">or call {offer.phone}</a></div>
            <Rating class="mt-6 text-night-ink lg:hidden" />
          </div>
          <HeroMedia c={c} />
        </div>
      </div>
    </section>
  );
}

/** The whole form in one place, for a page whose button comes down to it. */
function FormBand({ form }: { form: Child }) {
  return (
    <section id="quote" class="scroll-mt-4 bg-night py-14 sm:py-20">
      <div class={wrap + " grid items-center gap-x-14 gap-y-9 lg:grid-cols-2"}>
        <div class="text-night-ink">
          <h2 class="font-display text-section uppercase">{offer.coupon.offer}</h2>
          <p class="mt-1 font-display text-xl font-semibold uppercase text-gold">{offer.coupon.plus}</p>
          <p class="mt-3 max-w-md text-night-ink-2">{offer.formIntro}</p>
          <ul class="mt-6 grid gap-3">
            {offer.next.map((s) => <li class="flex gap-2.5"><Check class="text-gold" /><span>{s.title}</span></li>)}
          </ul>
          <p class="mt-7 text-night-ink-2">Rather talk? <a href={offer.phoneHref} class="font-semibold text-night-ink">{offer.phone}</a></p>
        </div>
        <div class={"rounded-card border-4 border-gold bg-surface p-6 text-ink sm:p-8 " + formLook}>{form ?? <CallInstead />}</div>
      </div>
    </section>
  );
}

const CallInstead = () => (
  <a href={offer.phoneHref} class={cta}>Call {offer.phone} for your free estimate</a>
);

const Numbers = () => (
  <section class="bg-accent text-accent-ink">
    <dl class={wrap + " grid grid-cols-2 gap-6 py-8 text-center md:grid-cols-3 [&>div:last-child]:col-span-2 md:[&>div:last-child]:col-span-1"}>
      {offer.numbers.map((n) => (
        <div>
          <dd class="flex min-h-12 items-center justify-center gap-2 whitespace-nowrap font-display text-section font-semibold uppercase sm:min-h-18 sm:gap-3 sm:text-display">
            {"mark" in n && n.mark === "google" ? <span class="grid size-9 place-items-center rounded-full bg-surface sm:size-12"><GoogleMark class="size-6 sm:size-8" /></span> : null}
            {n.value}
            {"mark" in n && n.mark === "stars" ? <Stars class="size-4 sm:size-6" /> : null}
          </dd>
          <dt class="mt-1 font-display text-xl font-semibold uppercase">{n.label}</dt>
        </div>
      ))}
    </dl>
  </section>
);

/** The terms point at the privacy policy; on this page, ours. */
const linkPolicy = (text: string) => {
  const [before, ...after] = text.split("the Privacy Policy.");
  return after.length ? <>{before}the <a href={offer.privacy}>Privacy Policy</a>.{after.join("the Privacy Policy.")}</> : text;
};

const Seals = () => offer.seals.length ? (
  <section class="bg-surface">
    <ul class={wrap + " flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-9"}>
      {offer.seals.map((s) => <li><img src={s.src} alt={s.alt} loading="lazy" class="h-12 w-auto max-w-36 object-contain sm:h-14" /></li>)}
    </ul>
  </section>
) : null;

const Cross = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" class="mt-0.5 size-6 shrink-0 text-coupon"><path d="m5 5 10 10M15 5 5 15" /></svg>
);

function Problem() {
  const p = offer.problem;
  return (
    <section class="py-14 sm:py-20">
      <div class={wrap + " grid items-center gap-x-14 gap-y-8 md:grid-cols-[1fr_1.3fr]"}>
        <img src={p.image.src} alt={p.image.alt} loading="lazy" class="aspect-[4/3] w-full rounded-card object-cover md:aspect-square" />
        <div>
          <h2 class="font-display text-section uppercase">{p.title}</h2>
          <ul class="mt-6 grid gap-3 text-xl font-semibold">
            {p.items.map((i) => <li class="flex gap-3"><Cross /><span>{i}</span></li>)}
          </ul>
          <p class="mt-6 rounded-control bg-night px-5 py-4 text-lg font-semibold text-night-ink">{p.close}</p>
        </div>
      </div>
    </section>
  );
}

function Backing() {
  const b = offer.backing;
  return (
    <section class="bg-night py-14 text-night-ink sm:py-20">
      <div class={wrap + " grid items-center gap-x-14 gap-y-8 lg:grid-cols-[1fr_1.25fr]"}>
        <div>
          <h2 class="font-display text-section uppercase">{b.title}</h2>
          <ul class="mt-7 grid gap-5">
            {b.items.map((i) => (
              <li class="flex gap-3">
                <Check class="text-gold" />
                <span><span class="block font-display text-2xl font-semibold uppercase">{i.title}</span> <span class="text-night-ink-2">{i.text}</span></span>
              </li>
            ))}
          </ul>
        </div>
        <img src={b.image.src} alt={b.image.alt} width={b.image.width} height={b.image.height} loading="lazy" class="h-auto w-full rounded-card border-4 border-surface" />
      </div>
    </section>
  );
}

function Different() {
  const d = offer.different;
  return (
    <section class="bg-panel py-14 sm:py-20">
      <div class={wrap + " grid items-center gap-x-14 gap-y-8 md:grid-cols-[1.3fr_1fr]"}>
        <div>
          <h2 class="font-display text-section uppercase">{d.title}</h2>
          <p class="mt-3 max-w-2xl text-lede text-ink">{d.lede}</p>
          <div class="mt-7 grid gap-6 sm:grid-cols-2">
            {d.columns.map((c) => (
              <div>
                <h3 class="font-display text-3xl font-semibold uppercase">{c.title}</h3>
                <ul class="mt-3 grid gap-2.5">
                  {c.items.map((i) => <li class="flex gap-2.5"><Check /><span>{i}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
          <p class="mt-7 font-semibold">{d.close}</p>
        </div>
        <img src={d.image.src} alt={d.image.alt} width={d.image.width} height={d.image.height} loading="lazy" class="h-auto w-full rounded-card" />
      </div>
    </section>
  );
}

/**
 * A service picked is the first question answered: on a stepped page that moves the form on, as clicking its card
 * would; on a button page it fills in the form's dropdown and goes down to it. Without JavaScript it goes to the form.
 */
const pickAnswer = `const q=document.querySelector('#quote');const r=q&&q.querySelector('input[type=radio][value="'+this.dataset.answer+'"]');if(r){event.preventDefault();r.click();return}const s=q&&q.querySelector('select[name=project]');if(s)s.value=this.dataset.answer`;

function Services() {
  return (
    <section class="py-14 sm:py-20">
      <div class={wrap}>
        <h2 class="font-display text-section uppercase">{offer.servicesTitle}</h2>
        <ul class="mt-8 grid gap-6 md:grid-cols-3">
          {offer.services.map((s) => (
            <li>
              <a href="#quote" data-answer={s.answer} onclick={pickAnswer} class="group flex h-full flex-col overflow-hidden rounded-card border-2 border-night bg-surface text-ink no-underline transition-transform hover:-translate-y-1">
                <img src={s.image.src} alt={s.image.alt} loading="lazy" class="aspect-[4/3] w-full object-cover" />
                <div class="flex flex-1 flex-col p-5">
                  <h3 class="font-display text-3xl font-semibold uppercase">{s.title}</h3>
                  <p class="mt-2 flex-1 text-ink-2">{s.text}</p>
                  <span class="mt-4 font-display text-2xl font-semibold uppercase text-accent group-hover:underline">Get a free quote →</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section class="bg-night py-14 text-night-ink sm:py-20">
      <div class={wrap}>
        <h2 class="text-center font-display text-section uppercase">Hear from our customers</h2>
        <Rating class="mt-3 justify-center" />
        <ul class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {offer.reviews.map((r) => (
            <li class="flex flex-col rounded-card bg-surface p-5 text-ink">
              <div class="flex items-center justify-between"><Stars /><GoogleMark class="size-5" /></div>
              <blockquote class="mt-3 flex-1">“{r.quote}”</blockquote>
              <p class="mt-4 text-label"><span class="font-semibold">{r.name}</span> <span class="text-ink-2">{r.where}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BeforeAfter() {
  const Shot = ({ src, label, alt }: { src: string; label: string; alt: string }) => (
    <div class="relative">
      <img src={src} alt={alt} loading="lazy" class="aspect-[3/4] w-full rounded-control object-cover" />
      <span class="absolute left-2 top-2 rounded-control bg-night px-2 py-0.5 text-label font-semibold text-night-ink">{label}</span>
    </div>
  );
  return (
    <section class="py-14 sm:py-20">
      <div class={wrap}>
        <h2 class="font-display text-section uppercase">{offer.beforeAfterTitle}</h2>
        <ul class="mt-8 grid gap-8 md:grid-cols-3">
          {offer.beforeAfter.map((p) => (
            <li>
              <div class="grid grid-cols-2 gap-2">
                <Shot src={p.before} label="Before" alt={`Before: ${p.what}`} />
                <Shot src={p.after} label="After" alt={`After: ${p.what}`} />
              </div>
              <p class="mt-3 text-ink-2">{p.what}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Guarantee({ call }: { call?: boolean }) {
  return (
    <section class="bg-gold py-14 text-ink sm:py-16">
      <div class={wrap + " grid items-center gap-8 md:grid-cols-[auto_1fr_auto]"}>
        <GuaranteeSeal dark class="-rotate-6" />
        <div>
          <h2 class="font-display text-section uppercase">{offer.guarantee.title}</h2>
          <p class="mt-3 max-w-2xl text-lg font-medium">{offer.guarantee.text}</p>
        </div>
        <a href={call ? offer.phoneHref : "#quote"} class="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-control bg-night px-8 font-display text-2xl font-semibold uppercase text-night-ink no-underline">{call ? offer.phone : "Get my free estimate"}</a>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section class="py-14 sm:py-20">
      <div class={wrap + " max-w-3xl"}>
        <h2 class="font-display text-section uppercase">FAQ</h2>
        <div class="mt-6 divide-y divide-line border-y border-line">
          {offer.faq.map((f) => (
            <details class="group py-4">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <span aria-hidden="true" class="text-xl text-ink-3 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p class="mt-2 text-ink-2">
                {f.a}{"call" in f ? <> {f.call} <a href={offer.phoneHref} class="whitespace-nowrap font-semibold text-accent">{offer.phone}</a></> : null}
              </p>
            </details>
          ))}
        </div>
        <div class="mt-9 text-center">
          <p class="font-display text-3xl font-semibold uppercase">{offer.faqClose}</p>
          <a href={offer.phoneHref} class={cta + " mt-4 gap-3"}><PhoneIcon class="size-6" />{offer.phone}</a>
        </div>
      </div>
    </section>
  );
}

/** The offer once more, to end on something to do. */
const LastCall = () => (
  <section class="bg-panel py-14 sm:py-20">
    <div class={wrap + " max-w-3xl text-center"}>
      <Coupon class="mx-auto max-w-3xl" />
      <a href="#quote" class={cta + " mt-7"}>Get my free estimate</a>
    </div>
  </section>
);

/** Lander 1, and each campaign's page: the first question in the hero, the problem next, the proof after it. */
export const StepPage = ({ c, form }: { c: Campaign; form: Child }) => (
  <>
    <StepHero c={c} form={form} />
    <Numbers />
    <Problem />
    <Different />
    <Reviews />
    <Services />
    <BeforeAfter />
    <Backing />
    <Seals />
    <Guarantee />
    <Faq />
    <LastCall />
  </>
);

/** Lander 2: a button in the hero, the same story, and the whole form near the end. */
export const ButtonPage = ({ c, form }: { c: Campaign; form: Child }) => (
  <>
    <ButtonHero c={c} />
    <Numbers />
    <Problem />
    <Different />
    <Reviews />
    <Services />
    <BeforeAfter />
    <Backing />
    <Seals />
    <Guarantee />
    <FormBand form={form} />
    <Faq />
  </>
);

/** Where the business works, how to reach it, and the small print. */
export function LanderFooter() {
  return (
    <footer class="bg-night text-night-ink">
      <div class={wrap + " grid gap-8 py-12 md:grid-cols-[1fr_auto]"}>
        <div>
          <p class="font-display text-title">{offer.business}</p>
          <p class="mt-2"><a href={offer.phoneHref} class="font-semibold text-night-ink no-underline hover:underline">{offer.phone}</a></p>
        </div>
        <div>
          <h2 class="text-label font-semibold text-night-ink-2">Our locations</h2>
          <ul class="mt-2 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {offer.locations.map((l) => (
              <li>
                <p class="font-semibold">{l.name}</p>
                <address class="text-label not-italic text-night-ink-2">{l.street}<br />{l.city}</address>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div class="border-t border-line-on-night">
        <div class={wrap + " py-5 text-base text-night-ink-2"}>
          <p class="max-w-4xl">{offer.smallPrint}</p>
          <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} {offer.business}</p>
            <p class="flex gap-5"><a href={offer.privacy} class="text-night-ink-2 hover:text-night-ink">Privacy policy</a> <a href={offer.terms} class="text-night-ink-2 hover:text-night-ink">Terms</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const LegalDoc = ({ doc }: { doc: LegalPage }) => (
  <main class="bg-surface py-12 sm:py-16">
    <article class="mx-auto max-w-3xl px-4">
      <h1 class="font-display text-section uppercase">{doc.title}</h1>
      {doc.blocks.map((b) =>
        b.t === "h2" ? <h2 class="mt-9 font-display text-3xl font-semibold uppercase">{b.text}</h2>
        : b.t === "ul" ? <ul class="mt-4 grid list-disc gap-2 pl-6">{b.items.map((i) => <li>{i}</li>)}</ul>
        : <p class="mt-4">{linkPolicy(b.text)}</p>,
      )}
    </article>
  </main>
);

/**
 * A step of the form on a page of its own: the rating above the question, and under it just enough to keep
 * them going, the promises and one review.
 */
export function FocusPage({ children }: { children?: Child }) {
  const review = offer.reviews[0];
  return (
    <div class="flex min-h-dvh flex-col bg-panel">
      <LanderHeader rating={false} quiet />
      <div class="mx-auto w-full max-w-2xl flex-1 py-6 sm:px-4 sm:py-10">
        <Rating class="mb-5 justify-center text-ink" />
        <div class={stepCard + " border-y-2 border-night bg-surface px-4 py-6 sm:rounded-card sm:border-2 sm:p-10 [&_form]:gap-3 " + formLook}>
          {children}
          <button type="button" onclick="this.parentElement.querySelector('form').requestSubmit()" class={cta + " " + shine + " " + stepNext}>Next</button>
          <FirstAnswer />
        </div>
        <QuietChecks class="mx-4 mt-6 sm:mx-0 sm:grid-cols-2" />
        <figure class="mx-4 mt-8 rounded-card border border-line bg-surface p-5 sm:mx-0">
          <div class="flex items-center justify-between"><Stars /><GoogleMark class="size-5" /></div>
          <blockquote class="mt-2">“{review.quote}”</blockquote>
          <figcaption class="mt-2 text-label"><span class="font-semibold">{review.name}</span> <span class="text-ink-2">{review.where}</span></figcaption>
        </figure>
      </div>
      <p class="flex justify-center gap-5 py-5 text-label text-ink-2"><a href={offer.privacy} class="text-ink-2">Privacy policy</a> <a href={offer.terms} class="text-ink-2">Terms</a></p>
    </div>
  );
}

const callButton = "inline-flex min-h-20 items-center justify-center gap-3 whitespace-nowrap rounded-control bg-gold px-6 font-display text-4xl font-semibold text-ink no-underline transition-transform hover:-translate-y-0.5 sm:px-10 sm:text-6xl";

const CallNow = () => (
  <a href={offer.phoneHref} class={callButton}><PhoneIcon class="size-8 sm:size-12" />{offer.phone}</a>
);

/**
 * After the form: they've just said they want this, so the first thing is the number to call, the biggest thing
 * on the page. Then everything that says they chose well. `children` is the form's own thank you.
 */
export const ThanksPage = ({ children }: { children?: Child }) => (
  <>
    <LanderHeader />
    <main>
      <section class="bg-night py-10 text-center text-night-ink sm:py-14">
        <div class={wrap}>
          <div class="[&_h1]:font-display [&_h1]:text-section [&_h1]:uppercase [&_h1]:text-gold [&_p]:text-lg">{children}</div>
          <h2 class="mx-auto mt-8 max-w-4xl font-display text-display uppercase">{offer.thanks.title}</h2>
          <div class="mt-7"><CallNow /></div>
          <p class="mt-5 text-xl font-semibold">{offer.thanks.call}</p>
        </div>
      </section>
      <Numbers />
      <section class="bg-panel py-14 sm:py-20">
        <div class={wrap + " grid items-center gap-x-14 gap-y-8 md:grid-cols-[1.3fr_1fr]"}>
          <div>
            <h2 class="font-display text-section uppercase">{offer.thanks.next}</h2>
            <ol class="mt-6 grid gap-4">
              {offer.next.map((s) => <li class="flex gap-2.5 text-copy"><Check /><span><span class="block font-semibold">{s.title}</span> <span class="block text-ink-2">{s.text}</span></span></li>)}
            </ol>
            <Coupon class="mt-8" />
          </div>
          <img src={offer.different.image.src} alt={offer.different.image.alt} width={offer.different.image.width} height={offer.different.image.height} loading="lazy" class="h-auto w-full rounded-card" />
        </div>
      </section>
      <Backing />
      <Seals />
      <Guarantee call />
      <Reviews />
      <section class="bg-night pb-14 text-center sm:pb-20">
        <div class={wrap}><CallNow /></div>
      </section>
    </main>
    <LanderFooter />
  </>
);
