import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  FileCheck2,
  FileText,
  FolderOpen,
  Layers3,
  MapPin,
  PenLine,
  Users,
} from "lucide-react";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { WorkspacePreview } from "./WorkspacePreview";
import styles from "./ReferenceHomepage.module.css";

const featureKeys = ["one", "two", "three", "four"] as const;
const featureIcons = [Building2, PenLine, Users, FileText];

export function ReferenceHomepage() {
  const t = useTranslations("landing");
  const locale = useLocale();
  const ne = locale === "ne";
  const copy = ne
    ? {
        eyebrow: "नेपालका निर्माण व्यवसायीका लागि",
        title: ["तयारी सरल।", "साझेदारी स्पष्ट।", "बोलपत्र व्यवस्थित।"],
        tools: "तपाईंको कामको आधार",
        toolsTitle: "राम्रो तयारीको सुरुवात यहीँबाट।",
        explore: "कार्यस्थल हेर्नुहोस्",
        preview: "कार्यस्थलको एक झलक",
        previewTitle: "हरेक विवरण।\nएउटै ठाउँमा।",
        previewBody:
          "परियोजना, साझेदार र कागजातहरू एउटै कार्यस्थलमा हेर्नुहोस्। तलका ट्याबहरूबाट नमुना अन्वेषण गर्नुहोस्।",
        workflow: "तयारीको यात्रा",
        workflowTitle: "अर्को बोलपत्रको स्पष्ट बाटो।",
        documents: "तपाईंका कागजात",
        sample: "नमुना कागजात",
        benefits: "किन TenderX",
        benefitsTitle: "काम अघि बढाउन थप स्पष्टता।",
        start: "आफ्नो अर्को बोलपत्र सुरु गर्नुहोस्",
        note: "सांकेतिक दृश्य · AI बाट सिर्जित",
        local: "नेपालका लागि निर्मित",
        reusable: "पुनः प्रयोगयोग्य प्रोफाइल",
        organised: "व्यवस्थित कागजात",
        language: "अङ्ग्रेजी र नेपाली",
      }
    : {
        eyebrow: "BUILT FOR NEPALI CONTRACTORS",
        title: ["Prepare Smarter.", "Partner Better.", "Bid with Confidence."],
        tools: "A STRONG FOUNDATION",
        toolsTitle: "Everything behind a well-prepared bid.",
        explore: "Explore the workspace",
        preview: "YOUR WORKSPACE, SIMPLIFIED",
        previewTitle: "Every detail.\nOne organised place.",
        previewBody:
          "Bring the moving parts of your bid together. Explore the sample project, partner profiles, and documents to see how it works.",
        workflow: "THE JOURNEY",
        workflowTitle: "A clearer path to your next bid.",
        documents: "FROM DETAILS TO DOCUMENTS",
        sample: "Sample document",
        benefits: "WHY TENDERX",
        benefitsTitle: "Clarity before your next submission.",
        start: "START YOUR NEXT CHAPTER",
        note: "Illustrative scene · AI-generated",
        local: "Built for Nepal",
        reusable: "Reusable company profiles",
        organised: "Organised bid documents",
        language: "English & नेपाली",
      };
  const register = `/${locale}/register`;
  return (
    <div className={styles.home}>
      <PublicHeader />
      <main id="main">
        <section className={styles.hero} aria-labelledby="home-title">
          <Image
            src="/images/tenderx-contractor-review1.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroShade} />
          <div className={`${styles.container} ${styles.heroBody}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span />
                {copy.eyebrow}
              </p>
              <h1 id="home-title">
                {copy.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p className={styles.heroDescription}>{t("hero.description")}</p>
              <div className={styles.actions}>
                <Link href={register} className={styles.primary}>
                  {t("hero.primaryCta")}
                  <ArrowRight size={17} />
                </Link>
                <a href="#how-it-works" className={styles.glass}>
                  {t("hero.secondaryCta")}
                  <ArrowDown size={16} />
                </a>
              </div>
            </div>
            <a href="#workspace" className={styles.heroCard}>
              <span className={styles.iconTile}>
                <Layers3 size={23} />
              </span>
              <span className={styles.heroCardTitle}>
                {ne ? "विवरण → साझेदार → कागजात" : "Plan → Prepare\n→ Generate"}
              </span>
              <span>{t("hero.summary")}</span>
              <span className={styles.heroCardLink}>
                {copy.explore}
                <ArrowRight size={17} />
              </span>
            </a>
            <small className={styles.photoNote}>{copy.note}</small>
          </div>
          <div className={styles.trustBar}>
            <div className={styles.container}>
              {[copy.local, copy.reusable, copy.organised, copy.language].map(
                (label, index) => (
                  <span key={label}>
                    {index === 0 ? <MapPin size={14} /> : <Check size={14} />}
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.foundation}`}
          id="features"
        >
          <div className={styles.container}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{copy.tools}</p>
              <h2>{copy.toolsTitle}</h2>
              <p>{t("features.description")}</p>
            </div>
            <div className={styles.featureGrid}>
              {featureKeys.map((key, i) => {
                const Icon = featureIcons[i];
                return (
                  <a href="#workspace" className={styles.featureCard} key={key}>
                    <div className={styles.featureArt}>
                      <Icon size={70} strokeWidth={1} />
                      <span className={styles.artLines}>
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className={styles.cardNumber}>0{i + 1}</span>
                    </div>
                    <div className={styles.featureContent}>
                      <span className={styles.iconTile}>
                        <Icon size={18} />
                      </span>
                      <h3>{t(`features.items.${key}.title`)}</h3>
                      <p>{t(`features.items.${key}.body`)}</p>
                      <span className={styles.textLink}>
                        {copy.explore}
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
        <section
          className={styles.previewSection}
          aria-labelledby="preview-heading"
        >
          <div className={`${styles.container} ${styles.previewGrid}`}>
            <div className={styles.previewFrame}>
              <WorkspacePreview />
            </div>
            <div className={styles.previewCopy}>
              <p className={styles.eyebrow}>{copy.preview}</p>
              <h2 id="preview-heading">{copy.previewTitle}</h2>
              <p>{copy.previewBody}</p>
              <ul>
                {["one", "two", "three"].map((key) => (
                  <li key={key}>
                    <Check size={17} />
                    {t(`valueStrip.items.${key}`)}
                  </li>
                ))}
              </ul>
              <Link href={register} className={styles.primary}>
                {t("hero.primaryCta")}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.journey}`}
          id="how-it-works"
        >
          <div className={styles.container}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{copy.workflow}</p>
              <h2>{copy.workflowTitle}</h2>
            </div>
            <div className={styles.steps}>
              {["one", "two", "three"].map((key, i) => (
                <article key={key}>
                  <span className={styles.stepNumber}>0{i + 1}</span>
                  <h3>{t(`workflow.steps.${key}.title`)}</h3>
                  <p>{t(`workflow.steps.${key}.body`)}</p>
                  {i < 2 && (
                    <ArrowRight className={styles.stepArrow} size={20} />
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.documents}`}
          id="documents"
        >
          <div className={styles.container}>
            <div className={styles.splitHeading}>
              <div>
                <p className={styles.eyebrow}>{copy.documents}</p>
                <h2>{t("docgen.title")}</h2>
              </div>
              <Link href={register} className={styles.textLink}>
                {t("nav.getStarted")}
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className={styles.sectionIntro}>{t("docgen.description")}</p>
            <div className={styles.documentGrid}>
              <article className={styles.reuseCard}>
                <Image
                  src="/images/tenderx-contractor-review1.png"
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 45vw"
                />
                <div>
                  <span className={styles.pill}>{t("reuse.eyebrow")}</span>
                  <h3>{t("reuse.title")}</h3>
                  <p>{t("reuse.description")}</p>
                  <small>{copy.note}</small>
                </div>
              </article>
              <div className={styles.documentStack}>
                {["one", "two", "three"].map((key, i) => (
                  <article key={key}>
                    <span className={styles.documentIcon}>
                      <FileText size={26} />
                    </span>
                    <div>
                      <small>
                        {copy.sample} / 0{i + 1}
                      </small>
                      <h3>{t(`docgen.docs.${key}`)}</h3>
                      <span className={styles.paperLines}>
                        <i />
                        <i />
                      </span>
                    </div>
                    <FileCheck2 size={19} />
                  </article>
                ))}
                <p className={styles.sampleNote}>
                  {t("preview.documents.note")}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={`${styles.section} ${styles.benefits}`}>
          <div className={styles.container}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{copy.benefits}</p>
              <h2>{copy.benefitsTitle}</h2>
            </div>
            <div className={styles.benefitGrid}>
              {featureKeys.map((key, i) => {
                const Icon = featureIcons[i];
                return (
                  <article key={key}>
                    <span className={styles.iconTile}>
                      <Icon size={20} />
                    </span>
                    <h3>{t(`features.items.${key}.title`)}</h3>
                    <p>{t(`features.items.${key}.body`)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section className={styles.closing}>
          <div className={`${styles.container} ${styles.cta}`}>
            <p className={styles.eyebrow}>{copy.start}</p>
            <h2>{t("closing.title")}</h2>
            <p>{t("hero.summary")}</p>
            <div className={styles.actions}>
              <Link href={register} className={styles.primary}>
                {t("hero.primaryCta")}
                <ArrowRight size={17} />
              </Link>
              <Link href={`/${locale}/login`} className={styles.glass}>
                <FolderOpen size={16} />
                {t("nav.logIn")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
