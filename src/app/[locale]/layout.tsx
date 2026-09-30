import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Manrope, Noto_Sans_Devanagari } from "next/font/google";
import { notFound } from "next/navigation";
import { defaultLocale, locales } from "@/i18n/request";
import { AuthProvider } from "@/lib/auth-context";
import { BidProvider } from "@/lib/bid-context";
import { QueryProvider } from "@/lib/query-provider";
import { RevealProvider } from "@/components/public/RevealProvider";
import "../globals.css";
import "../desk.css";
import "../hero.css";

const SITE_URL = "https://tenderxnepal.com";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const openGraphLocale = locale === "ne" ? "ne_NP" : "en_US";
  const alternateLocale = locale === "ne" ? "en_US" : "ne_NP";

  return {
    metadataBase: new URL(SITE_URL),
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    keywords: t("keywords"),
    applicationName: "TenderX Nepal",
    authors: [{ name: "TenderX Nepal", url: SITE_URL }],
    creator: "TenderX Nepal",
    publisher: "TenderX Nepal",
    category: "business",
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    openGraph: {
      type: "website",
      siteName: "TenderX Nepal",
      locale: openGraphLocale,
      alternateLocale,
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      images: [{ url: "/logo.png", width: 321, height: 211, alt: "TenderX Nepal" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      images: ["/logo.png"],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${manrope.variable} ${notoDevanagari.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <BidProvider>
                <RevealProvider>{children}</RevealProvider>
              </BidProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
