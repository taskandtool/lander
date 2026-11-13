// What the landers say, in one place, for one business. This one is made up: Example Auto Detailing does not exist, its
// legal pages, address and reviews are placeholders, and the photos are stock from Pexels. Making it a real business's
// means replacing this file. Never add a review or a figure the business did not give. Each campaign's page shares all
// of this and changes only its headline, its line under it and its photo.
const IMG = "/images/lander";
export const offer = {
  business: "Example Auto Detailing",
  logo: "",
  locations: [
    { name: "Placeholder", street: "Address placeholder", city: "City placeholder" },
  ],
  /** Trust seals, each one the business really holds. */
  seals: [] as { src: string; alt: string }[],
  phone: "(555) 555-0100",
  phoneHref: "tel:+15555550100",
  rating: { score: "0.0", count: "0", where: "Google" },
  /** The big numbers, right under the hero. */
  numbers: [
    { value: "0", label: "Google reviews", mark: "google" },
    { value: "0.0", label: "Average rating", mark: "stars" },
    { value: "0", label: "Cars detailed" },
  ],
  checks: [
    "Inside and out",
    "We come to you",
    "Book in a minute",
    "Pay when it's done",
  ],
  /** The coupon: the offer in as few words as it takes, and one more reason. */
  coupon: { offer: "20% off your first detail", plus: "Plus a free air freshener" },
  guarantee: {
    badge: ["Happy", "or free"],
    title: "Love it or it's free",
    text: "Guarantee placeholder.",
  },
  /** One line at the foot of every page, for what the headline can't say. */
  smallPrint: "Placeholder.",
  /** The box under the phone field, unticked and optional, in the business's own words. What they agreed to is saved on the lead. */
  textConsent: "I agree that Example Auto Detailing may call or text me about my request. I am not required to give this authorization to buy anything. Message and data rates may apply. Placeholder.",
  privacy: "/privacy",
  terms: "/terms",
  forms: { stepped: "estimate", allAtOnce: "estimate-now" },
  currency: "USD",
  /** On the form's own steps, in place of the coupon: a reminder, not a shout. */
  claiming: "You're claiming 20% off",
  /** The page after the form: the moment they're likeliest to call. */
  thanks: {
    title: "Want it done sooner? Call now",
    call: "Ask us anything",
    next: "What happens next",
  },
  next: [
    { title: "We call to find a time", text: "Whenever suits you" },
    { title: "We come to you", text: "At home or at work" },
    { title: "Your car looks new again", text: "Inside and out" },
  ],
  formIntro: "Tell us a little about your car.",
  servicesTitle: "What we do",
  beforeAfterTitle: "Before and after",
  beforeAfter: [
    { before: `${IMG}/before-1.jpg`, after: `${IMG}/after-1.jpg`, what: "Placeholder" },
    { before: `${IMG}/before-2.jpg`, after: `${IMG}/after-2.jpg`, what: "Placeholder" },
    { before: `${IMG}/before-3.jpg`, after: `${IMG}/after-3.jpg`, what: "Placeholder" },
  ],
  /** Who this is for and what's wrong now: first after the numbers. */
  problem: {
    title: "Your car deserves better than a drive-through wash",
    image: { src: `${IMG}/problem.jpg`, alt: "A car covered in dirt" },
    items: ["Swirl marks in the paint", "Crumbs in every seat", "That smell you can't place", "Brake dust on the wheels"],
    close: "We fix what a car wash can't",
  },
  /** Who does the work and what backs it. */
  backing: {
    title: "Who does the work",
    image: { src: `${IMG}/team.jpg`, alt: "People washing a car", width: 1300, height: 867 },
    items: [
      { title: "Placeholder", text: "Placeholder" },
      { title: "Placeholder", text: "Placeholder" },
      { title: "Placeholder", text: "Placeholder" },
      { title: "Placeholder", text: "Placeholder" },
    ],
  },
  /** How they're different, in the owner's words. */
  different: {
    title: "Why people choose us",
    lede: "Placeholder.",
    image: { src: `${IMG}/people.jpg`, alt: "Someone detailing a car", width: 1300, height: 867 },
    columns: [
      { title: "Outside", items: ["Hand wash and dry", "Wheels and tires", "Wax or sealant"] },
      { title: "Inside", items: ["Vacuum and steam", "Seats and carpets", "Glass and trim"] },
    ],
    close: "Placeholder",
  },
  /** What they can have done. Each is a way into the form: `answer` is the first question's answer it gives. */
  services: [
    { title: "Exterior wash", answer: "Exterior wash", text: "A hand wash, wheels and a wax", image: { src: `${IMG}/wash.jpg`, alt: "A car covered in foam" } },
    { title: "Interior detail", answer: "Interior detail", text: "Seats, carpets, glass and trim", image: { src: `${IMG}/interior.jpg`, alt: "A clean car interior" } },
    { title: "Paint protection", answer: "Paint protection", text: "A polish and a coating that lasts", image: { src: `${IMG}/coating.jpg`, alt: "A polished car" } },
  ],
  reviews: [
    { quote: "Placeholder.", name: "Placeholder", where: "Placeholder" },
    { quote: "Placeholder.", name: "Placeholder", where: "Placeholder" },
    { quote: "Placeholder.", name: "Placeholder", where: "Placeholder" },
    { quote: "Placeholder.", name: "Placeholder", where: "Placeholder" },
  ],
  /** `call` leads into the phone number, for an answer where talking would help. */
  faq: [
    { q: "How long does a detail take?", a: "Placeholder.", call: "Want to know for your car? Call us at" },
    { q: "Do I need to be there?", a: "Placeholder." },
    { q: "Do you come to my area?", a: "Fill out the form with your ZIP code and we'll let you know.", call: "Or call us at" },
  ],
  faqClose: "Got another question? Call us",
};

export type Campaign = { path: string; headline: { before: string; accent: string; after?: string }; lede: string; hero: { image: string; alt: string } };

const main: Omit<Campaign, "path"> = {
  headline: { before: "Get your car", accent: "looking new again", after: "this week" },
  lede: "We come to you and clean it inside and out.",
  hero: { image: `${IMG}/hero.jpg`, alt: "A car being polished" },
};

/** Lander 1, the stepped form; lander 2, the button down to the form. Each opens on the benefit. */
export const STEPPED: Campaign = { path: "/", ...main };
export const BUTTON: Campaign = { path: "/estimate", ...main };

/** Lander 3: the same page with a different promise, one address per ad campaign. */
export const CAMPAIGNS: Campaign[] = [
  {
    path: "/offer",
    headline: { before: "Get", accent: "20% off", after: "your first detail" },
    lede: "Book this month and your first detail is 20% off.",
    hero: { image: `${IMG}/hero-offer.jpg`, alt: "A clean, shiny car" },
  },
  {
    path: "/interior",
    headline: { before: "Get a spotless interior", accent: "without leaving home" },
    lede: "We come to you and clean every seat, carpet and window.",
    hero: { image: `${IMG}/hero-full.jpg`, alt: "A car's interior being cleaned" },
  },
];

const icon = (name: string) => `/images/lander/${name}.svg`;
// Phone last, so the texting box under it ("the number provided above") sits right above the button.
const contact = [
  { name: "name", label: "Your name", type: "text", required: true, autocomplete: "name" },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
];
const SERVICES = ["Exterior wash", "Interior detail", "Full detail", "Paint protection"];

/** The two forms: saved by `npm run migrate` the first time, and edited as rows after that. */
export const FORMS = [
  {
    key: offer.forms.stepped,
    title: "Book your detail",
    submit_label: "Book my detail",
    follow_up: true,
    success_message: "Thanks! We'll call to find a time.",
    fields: [
      { name: "step_project", label: "What kind of wash do you want?", type: "page" },
      { name: "project", label: "What kind of wash do you want?", type: "radio", required: true, cards: true, options: SERVICES, option_images: { "Exterior wash": icon("wash"), "Interior detail": icon("interior"), "Full detail": icon("full"), "Paint protection": icon("coating") } },
      { name: "step_vehicle", label: "What are you driving?", type: "page" },
      { name: "vehicle", label: "What are you driving?", type: "radio", required: true, cards: true, options: ["Car", "SUV", "Truck", "Van"] },
      { name: "step_when", label: "When do you need it?", type: "page" },
      { name: "when", label: "When do you need it?", type: "radio", required: true, cards: true, options: ["This week", "This month", "Just looking for now"] },
      { name: "step_zip", label: "What's your ZIP code?", type: "page" },
      { name: "zip", label: "ZIP code", type: "text", required: true, autocomplete: "postal-code", help: "So we can check we serve your area." },
      { name: "step_contact", label: "Where should we reach you?", type: "page" },
      ...contact,
    ],
  },
  {
    key: offer.forms.allAtOnce,
    title: "Book your detail",
    submit_label: "Book my detail",
    follow_up: true,
    success_message: "Thanks! We'll call to find a time.",
    fields: [
      { name: "project", label: "What are you looking for?", type: "select", required: true, options: SERVICES },
      { name: "zip", label: "ZIP code", type: "text", required: true, autocomplete: "postal-code" },
      ...contact,
    ],
  },
];
