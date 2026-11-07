// The privacy policy and terms the footer links to: the business's own, word for word.
export type LegalBlock = { t: "h2" | "p"; text: string } | { t: "ul"; items: string[] };
export type LegalPage = { title: string; blocks: LegalBlock[] };

export const LEGAL: Record<"privacy" | "terms", LegalPage> = {
  privacy: { title: "Privacy", blocks: [{ t: "p", text: "Placeholder." }] },
  terms: { title: "Terms", blocks: [{ t: "p", text: "Placeholder." }] },
};
