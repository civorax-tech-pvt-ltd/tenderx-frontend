import type { MetadataRoute } from "next";

const SITE_URL = "https://tenderxnepal.com";

/**
 * Public marketing pages are crawlable and indexed.
 * Auth and workspace routes carry page-level `<meta name="robots" content="noindex, nofollow" />`
 * so search engines can read and respect the de-indexing instructions.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
