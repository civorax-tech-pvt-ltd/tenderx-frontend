import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="flex items-center justify-between border-b border-ink-200 bg-white px-6 py-4 dark:border-ink-800 dark:bg-ink-900">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            TX
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-ink-900 dark:text-ink-100">
              {t("app.name")}
            </p>
            <p className="text-xs leading-tight text-ink-500">{t("app.tagline")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="flex h-8 items-center rounded-lg bg-brand-500 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
          >
            {t("home.login")}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-100 sm:text-4xl">
          {t("app.tagline")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-500">{t("home.description")}</p>
        <Link
          href="/register"
          className="mt-8 inline-flex h-10 items-center rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          {t("home.getStarted")}
        </Link>
      </section>
    </main>
  );
}
