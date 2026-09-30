import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for locale routing.
 *
 * `localePrefix: "always"` means every public URL carries its locale segment
 * (`/en`, `/ne`). Unprefixed paths such as `/login` are redirected to the
 * default locale by `src/middleware.ts`, so there is exactly one canonical URL
 * per page per locale — required for the hreflang set and sitemap to be valid.
 */
export const routing = defineRouting({
  locales: ["en", "ne"],
  defaultLocale: "en",
  localePrefix: "always",
});
