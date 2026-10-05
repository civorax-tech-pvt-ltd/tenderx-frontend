import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { TendersPage } from "@/components/public/TendersPage";
import { TendersJsonLd } from "@/components/public/TendersJsonLd";

const SITE_URL = "https://tenderxnepal.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const title =
    locale === "ne"
      ? "नेपाल टेन्डर सूचनाहरू | TenderX Nepal"
      : "Nepal Tender Notices — Latest Government & Newspaper Tenders | TenderX Nepal";
  const description =
    locale === "ne"
      ? "नेपालका सरकारी र अखबारका ताजा टेन्डर सूचनाहरू हेर्नुहोस्। PPMO e-GP र राष्ट्रिय अखबारबाट दैनिक अपडेट।"
      : "Browse latest government and newspaper tender notices from Nepal. Updated daily from PPMO e-GP and national newspapers.";

  return {
    title,
    description,
    keywords: t("keywords"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/tenders`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/tenders`])),
        "x-default": `${SITE_URL}/${routing.defaultLocale}/tenders`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/tenders`,
      siteName: "TenderX Nepal",
      locale: locale === "ne" ? "ne_NP" : "en_US",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <TendersJsonLd locale={locale} />
      <TendersPage />
    </>
  );
}
