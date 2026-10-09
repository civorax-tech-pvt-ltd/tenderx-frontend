// Mirrors app/services/validation.py for instant client-side feedback.
// The authoritative check still happens server-side via POST /bid/validate at generation time.

import { PERCENTAGE_KEYS } from "@/lib/constants";

export type FieldData = Record<string, string>;

export function parsePercentage(raw: string | undefined): number {
  if (!raw) return 0;
  const n = parseFloat(raw.replace("%", "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function percentageTotal(fieldData: FieldData): number {
  const isSingle = fieldData.BID_TYPE === "Single Bidder";
  // A single bidder owns 100% by definition; no ownership split is entered.
  if (isSingle) return 100;

  const hasFirst = Boolean(fieldData.FIRST_PARTNER_NAME);
  const hasSecond = Boolean(fieldData.SECOND_PARTNER_NAME);

  let total = parsePercentage(fieldData[PERCENTAGE_KEYS.lead]);
  if (hasFirst) total += parsePercentage(fieldData[PERCENTAGE_KEYS.first]);
  if (hasSecond) total += parsePercentage(fieldData[PERCENTAGE_KEYS.second]);
  return Math.round(total * 100) / 100;
}

export function isSplitValid(fieldData: FieldData): boolean {
  return Math.abs(percentageTotal(fieldData) - 100) < 0.01;
}

export function determinePartnerCount(fieldData: FieldData): number {
  if (fieldData.BID_TYPE === "Single Bidder") return 1;
  if (fieldData.SECOND_PARTNER_NAME) return 3;
  if (fieldData.FIRST_PARTNER_NAME) return 2;
  return 1;
}

export function suggestedJvName(fieldData: FieldData): string {
  const shorts = [fieldData.LEAD_PARTNER_SHORT, fieldData.FIRST_PARTNER_SHORT, fieldData.SECOND_PARTNER_SHORT].filter(
    Boolean
  );
  if (shorts.length === 0) return "";
  return `${shorts.join(" - ")} J/V`;
}

/** Whether a bid-builder step has its essential fields filled (drives the stepper checkmarks). */
export function stepComplete(fieldData: FieldData, step: "project" | "lead" | "first" | "second"): boolean {
  switch (step) {
    case "project":
      return Boolean(fieldData.JV_NAME && fieldData.PROJECT_NAME && fieldData.EMPLOYER_NAME);
    case "lead":
      return Boolean(fieldData.LEAD_PARTNER_NAME && (fieldData.BID_TYPE === "Single Bidder" || fieldData.L_PER));
    case "first":
      return Boolean(fieldData.FIRST_PARTNER_NAME && fieldData.F_PER);
    case "second":
      return Boolean(fieldData.SECOND_PARTNER_NAME && fieldData.S_PER);
  }
}

export type Readiness = {
  partnerNamesFilled: boolean;
  splitComplete: boolean;
  signaturePresent: boolean;
};

export function readiness(fieldData: FieldData, hasAuthorizedSignature: boolean): Readiness {
  const isSingle = fieldData.BID_TYPE === "Single Bidder";
  const partnerNamesFilled = isSingle
    ? Boolean(fieldData.LEAD_PARTNER_NAME)
    : Boolean(fieldData.LEAD_PARTNER_NAME) &&
      (!fieldData.FIRST_PARTNER_NAME || Boolean(fieldData.FIRST_PARTNER_NAME)) &&
      (!fieldData.SECOND_PARTNER_NAME || Boolean(fieldData.SECOND_PARTNER_NAME));

  return {
    partnerNamesFilled,
    splitComplete: isSplitValid(fieldData),
    signaturePresent: hasAuthorizedSignature,
  };
}

/**
 * Clamp a typed ownership value so the partners together never exceed 100%.
 * Keeps only digits and one decimal point, and caps at what the other partners leave free.
 */
export function clampPercentage(fieldData: FieldData, key: string, raw: string): string {
  let v = raw.replace("%", "").replace(/[^\d.]/g, "");
  const dot = v.indexOf(".");
  if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, "");
  if (v === "" || v === ".") return v;

  const isSingle = fieldData.BID_TYPE === "Single Bidder";
  const others = isSingle
    ? 0
    : Object.values(PERCENTAGE_KEYS)
        .filter((k) => k !== key)
        .reduce((sum, k) => sum + parsePercentage(fieldData[k]), 0);
  const max = Math.max(0, Math.round((100 - others) * 100) / 100);
  return parseFloat(v) > max ? String(max) : v;
}
