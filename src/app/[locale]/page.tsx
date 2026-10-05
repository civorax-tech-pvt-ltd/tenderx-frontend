import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ReferenceHomepage } from "@/components/public/ReferenceHomepage";
import { JsonLd } from "@/components/public/JsonLd";
import { AdPopup } from "@/components/public/AdPopup";

const SITE_URL = "https://tenderxnepal.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const ogLocale = locale === "ne" ? "ne_NP" : "en_US";
  const altLocale = locale === "ne" ? "en_US" : "ne_NP";

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    keywords: t("keywords"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}`])),
        "x-default": `${SITE_URL}/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      siteName: "TenderX Nepal",
      title: t("homeTitle"),
      description: t("homeDescription"),
      locale: ogLocale,
      alternateLocale: altLocale,
      images: [
        {
          url: `${SITE_URL}/logo.png`,
          width: 321,
          height: 211,
          alt: "TenderX Nepal — Bolpatra & Tender Workspace",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: [`${SITE_URL}/logo.png`],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <JsonLd locale={locale} />
      <AdPopup />
      <ReferenceHomepage />
    </>
  );
}
