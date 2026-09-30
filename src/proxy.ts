import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts`.
 *
 * Uses the shared `routing` config (localePrefix: "always"), so every public
 * URL carries a locale segment. `/` redirects to `/en` and unprefixed paths
 * such as `/login` redirect to `/en/login`, giving one canonical URL per page
 * per locale for the hreflang set and sitemap.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
