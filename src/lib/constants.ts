// Mirrors app/core/constants.py — keep in sync with the backend.

export const PARTNER_ROLES = ["lead", "first", "second"] as const;
export type PartnerRole = (typeof PARTNER_ROLES)[number];

export const ROLE_PREFIXES: Record<PartnerRole, string> = {
  lead: "LEAD",
  first: "FIRST",
  second: "SECOND",
};

export const PERCENTAGE_KEYS: Record<PartnerRole, string> = {
  lead: "L_PER",
  first: "F_PER",
  second: "S_PER",
};

export const ATTACHMENT_CATEGORIES = [
  "experience",
  "registration",
  "audits",
  "bank_guarantee",
  "line_of_credit",
] as const;
export type AttachmentCategory = (typeof ATTACHMENT_CATEGORIES)[number];

export function roleImageKeys(role: PartnerRole) {
  const p = ROLE_PREFIXES[role];
  return {
    ceoSig: `${p}_CEO_SIG`,
    stamp: `${p}_STAMP`,
    md1: `${p}_PARTNER_MD1`,
    md2: `${p}_PARTNER_MD2`,
  };
}

export function roleFieldKey(role: PartnerRole, field: string) {
  return `${ROLE_PREFIXES[role]}_${field}`;
}
