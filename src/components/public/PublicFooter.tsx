import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** Footer (§18): ink background, no dead links. */
export function PublicFooter() {
  const t = useTranslations("landing.footer");
  const tNav = useTranslations("landing.nav");
  const d = useTranslations("desk");
  const locale = useLocale();

  return (
    <footer className="bg-blue-950 text-slate-200">
      <div className="container-x py-16">
        <p className="desk-footer-complete">{d("complete")} <Check size={13} /></p>
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Wordmark tone="dark" />
            <p className="mt-4 max-w-[240px] text-[15px] text-slate-200">{t("tagline")}</p>
          </div>

          <nav aria-label={t("productTitle")}>
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-white">
              {t("productTitle")}
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`/${locale}#workspace`}
                  className="text-[15px] text-slate-200 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {d("product")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}#how-it-works`}
                  className="text-[15px] text-slate-200 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {tNav("howItWorks")}
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label={t("accountTitle")}>
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-white">
              {t("accountTitle")}
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href={`/${locale}/login`}
                  className="text-[15px] text-slate-200 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {tNav("logIn")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/register`}
                  className="text-[15px] text-slate-200 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {tNav("getStarted")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-white">
              {t("languageTitle")}
            </p>
            <div className="mt-4">
              <LanguageSwitcher tone="dark" />
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-blue-400/40" aria-hidden />

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-slate-300">{t("madeFor")}</p>
          <p className="text-[14px] text-slate-300">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
