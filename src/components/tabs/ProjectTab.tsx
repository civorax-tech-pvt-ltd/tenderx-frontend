"use client";

import { useTranslations } from "next-intl";
import { FormCard } from "@/components/ui/FormCard";
import { SelectField, TextField } from "@/components/ui/FormField";
import { useBid } from "@/lib/bid-context";

export function ProjectTab() {
  const t = useTranslations("project");
  const { fieldData } = useBid();
  const isSingle = fieldData.BID_TYPE === "Single Bidder";

  const authorizedOptions = [fieldData.LEAD_PARTNER_CEO, fieldData.FIRST_PARTNER_CEO, fieldData.SECOND_PARTNER_CEO]
    .filter(Boolean)
    .map((name) => ({ value: name as string, label: name as string }));

  return (
    <div className="flex flex-col gap-4">
      <FormCard title={isSingle ? t("firmName") : t("jvName")} subtitle={t("jvNameHint")}>
        <TextField fieldKey="JV_NAME" label={isSingle ? t("firmName") : t("jvName")} span={2} />
        <TextField fieldKey="JV_ADDRESS" label={t("jvAddress")} span={2} />
      </FormCard>

      <FormCard title={t("tenderDetails")}>
        <TextField fieldKey="PROJECT_NAME" label={t("projectName")} span={2} />
        <TextField fieldKey="IFB_NUMBER" label={t("ifbNumber")} />
        <TextField fieldKey="BID_DATE" label={t("bidDate")} type="date" />
        <TextField fieldKey="BID_VALIDITY_PERIOD" label={t("bidValidity")} />
      </FormCard>

      <FormCard title={t("employer")}>
        <TextField fieldKey="EMPLOYER_NAME" label={t("employerName")} span={2} />
        <TextField fieldKey="EMPLOYER_ADDRESS" label={t("employerAddress")} span={2} />
      </FormCard>

      <FormCard title={t("authorisedSignatory")}>
        <SelectField fieldKey="AUTHORIZED_PERSON_NAME" label={t("authorizedPerson")} options={authorizedOptions} span={2} />
      </FormCard>
    </div>
  );
}
