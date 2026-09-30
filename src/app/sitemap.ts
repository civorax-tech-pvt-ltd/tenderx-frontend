import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = "https://tenderxnepal.com";

/**
 * Only public marketing routes belong here. Auth/workspace routes are
 * `noindex` + disallowed in robots.ts and must not be advertised to crawlers.
 */
const PUBLIC_PATHS: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales, defaultLocale } = routing;

  return PUBLIC_PATHS.flatMap(({ path, priority }) => {
    const languages: Record<string, string> = Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
    );
    languages["x-default"] = `${SITE_URL}/${defaultLocale}${path}`;

    return locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
