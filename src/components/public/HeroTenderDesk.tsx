import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, ArrowRight, Check, FileText } from "lucide-react";

/** Candid workplace imagery paired with a readable, localized product detail. */
export function HeroTenderDesk() {
  const t = useTranslations("landing.hero");
  const d = useTranslations("desk");
  const p = useTranslations("landing.preview");
  const e = useTranslations("editorial");
  const locale = useLocale();

  return (
    <section className="editorial-hero" aria-labelledby="hero-title">
      <div className="container-x editorial-hero-grid">
        <div className="editorial-hero-copy">
          <p className="editorial-kicker">{t("eyebrow")}</p>
          <h1 id="hero-title">{t("titleLine1")}<br /><span>{t("titleLine2")}</span></h1>
          <p className="editorial-intro">{t("summary")}</p>
          <div className="editorial-actions">
            <Link href={`/${locale}/register`} className="btn-primary">{t("primaryCta")}<ArrowRight size={18} aria-hidden="true" /></Link>
            <a href="#workspace">{d("explore")}<ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <p className="editorial-trust">{t("trustNote")}</p>
          <div className="editorial-margin-note"><span aria-hidden="true">↳</span><p>{e("heroNote")}</p></div>
        </div>

        <figure className="editorial-portrait">
          <div className="editorial-portrait-heading"><span>{e("photoHeading")}</span><span>NEPAL / TX</span></div>
          <div className="editorial-portrait-image">
            <Image
              src="/images/tenderx-contractor-review0.png"
              alt={e("photoAlt")}
              width={1122}
              height={1402}
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 45vw, 563px"
              preload
            />
          </div>
          <div className="editorial-photo-document">
            <span className="editorial-photo-file"><FileText size={23} aria-hidden="true" /></span>
            <div><p>{p("samplePill")} / 024</p><strong>{d("agreement")}.pdf</strong><span><Check size={12} aria-hidden="true" />{d("ready")}</span></div>
            <span className="editorial-photo-monogram" aria-hidden="true">TX</span>
          </div>
          <figcaption>{e("photoCaption")}<span>{t("photoNote")}</span></figcaption>
        </figure>
      </div>
      <div className="container-x editorial-hero-foot"><span>{d("workspaceSubtitle")}</span><a href="#workspace">{e("followBid")}<ArrowDown size={14} aria-hidden="true" /></a></div>
    </section>
  );
}
