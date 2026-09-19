import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";
import { AuthProvider } from "@/lib/auth-context";
import { BidProvider } from "@/lib/bid-context";
import { QueryProvider } from "@/lib/query-provider";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TenderX Nepal — Joint Venture Bid Workspace",
  description: "Prepare, manage and generate joint-venture tender bid documents.",
};

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
    <html lang={locale} className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <BidProvider>{children}</BidProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
