"use client";

import { Briefcase, Building, FileSignature, Landmark, Shapes, Users2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormCard } from "@/components/ui/FormCard";
import { SelectField, TextField } from "@/components/ui/FormField";
import { useBid } from "@/lib/bid-context";

/** JV vs single bidder. Shown on the first builder step since it decides whether partner steps 2–3 apply. */
export function BidTypeCard() {
  const t = useTranslations("project");
  const tDash = useTranslations("dash.form");
  const { fieldData, setField } = useBid();

  const bidTypes = [
    { value: "Joint Venture", label: t("bidTypeJv"), hint: tDash("jvHint"), icon: Users2 },
    { value: "Single Bidder", label: t("bidTypeSingle"), hint: tDash("singleHint"), icon: User },
  ];

  return (
    <FormCard title={t("bidType")} subtitle={tDash("bidTypeHint")} icon={Shapes}>
      <div role="radiogroup" aria-label={t("bidType")} className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2">
        {bidTypes.map(({ value, label, hint, icon: Icon }) => {
          const selected = (fieldData.BID_TYPE || "Joint Venture") === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setField("BID_TYPE", value)}
              className={`flex items-start gap-3 rounded-sm border p-3 text-left transition ${
                selected
                  ? "border-blue-500 bg-blue-50/70 ring-4 ring-blue-500/10"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${
                  selected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon size={16} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">{label}</span>
                <span className="block text-xs text-slate-500">{hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </FormCard>
  );
}

export function ProjectTab() {
  const t = useTranslations("project");
  const tDash = useTranslations("dash.form");
  const { fieldData } = useBid();
  const isSingle = fieldData.BID_TYPE === "Single Bidder";

  const authorizedOptions = (
    [
      { role: "lead", name: fieldData.LEAD_PARTNER_CEO },
      { role: "first", name: fieldData.FIRST_PARTNER_CEO },
      { role: "second", name: fieldData.SECOND_PARTNER_CEO },
    ] as const
  )
    .filter(({ name }) => Boolean(name))
    .map(({ role, name }) => ({ value: name as string, label: name as string, key: `${role}-${name}` }));

  return (
    <div className="flex flex-col gap-6">
      <FormCard title={isSingle ? t("firmName") : t("jvName")} subtitle={t("jvNameHint")} icon={Briefcase}>
        <TextField
          fieldKey="JV_NAME"
          label={isSingle ? t("firmName") : t("jvName")}
          placeholder={isSingle ? tDash("firmNamePlaceholder") : tDash("jvNamePlaceholder")}
          span={2}
        />
        <TextField fieldKey="JV_ADDRESS" label={t("jvAddress")} placeholder={tDash("addressPlaceholder")} span={2} />
      </FormCard>

      <FormCard title={t("tenderDetails")} subtitle={tDash("tenderDetailsHint")} icon={Landmark}>
        <TextField fieldKey="PROJECT_NAME" label={t("projectName")} span={2} />
        <TextField fieldKey="IFB_NUMBER" label={t("ifbNumber")} placeholder={tDash("ifbPlaceholder")} />
        <TextField fieldKey="BID_DATE" label={t("bidDate")} type="date" />
        <TextField fieldKey="BID_VALIDITY_PERIOD" label={t("bidValidity")} placeholder="120 days" />
      </FormCard>

      <FormCard title={t("employer")} subtitle={tDash("employerHint")} icon={Building}>
        <TextField fieldKey="EMPLOYER_NAME" label={t("employerName")} span={2} />
        <TextField fieldKey="EMPLOYER_ADDRESS" label={t("employerAddress")} span={2} />
      </FormCard>

      <FormCard title={t("authorisedSignatory")} subtitle={tDash("signatoryHint")} icon={FileSignature}>
        <SelectField
          fieldKey="AUTHORIZED_PERSON_NAME"
          label={t("authorizedPerson")}
          options={authorizedOptions}
          span={2}
          hint={authorizedOptions.length === 0 ? tDash("noSignatoryYet") : undefined}
        />
      </FormCard>
    </div>
  );
}
