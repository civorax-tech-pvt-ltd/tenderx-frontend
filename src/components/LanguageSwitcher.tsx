"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: string) {
    const segments = pathname.split("/");
    const isLocaleSegment = segments[1] === "en" || segments[1] === "ne";
    if (isLocaleSegment) segments[1] = next;
    else segments.splice(1, 0, next);
    router.push(segments.join("/") || "/");
  }

  return (
    <div className="inline-flex items-center rounded-full border border-ink-200 bg-white p-0.5 text-xs font-medium dark:border-ink-700 dark:bg-ink-900">
      {(["en", "ne"] as const).map((code) => (
        <button
          key={code}
          onClick={() => switchTo(code)}
          className={`rounded-full px-3 py-1 transition-colors ${
            locale === code
              ? "bg-brand-500 text-white"
              : "text-ink-500 hover:text-ink-900 dark:hover:text-ink-100"
          }`}
        >
          {code === "en" ? t("english") : t("nepali")}
        </button>
      ))}
    </div>
  );
}
