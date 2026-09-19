// Mirrors app/services/validation.py for instant client-side feedback.
// The authoritative check still happens server-side via POST /bid/validate at generation time.

import { PERCENTAGE_KEYS } from "@/lib/constants";

export type FieldData = Record<string, string>;

function parsePercentage(raw: string | undefined): number {
  if (!raw) return 0;
  const n = parseFloat(raw.replace("%", "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function percentageTotal(fieldData: FieldData): number {
  const isSingle = fieldData.BID_TYPE === "Single Bidder";
  if (isSingle) return parsePercentage(fieldData[PERCENTAGE_KEYS.lead]);

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
