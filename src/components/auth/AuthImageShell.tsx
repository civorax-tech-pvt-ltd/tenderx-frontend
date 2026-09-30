import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { BrandLink } from "@/components/public/Wordmark";
import styles from "./AuthImageShell.module.css";

export type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerSlot?: React.ReactNode;
};

export function AuthImageShell({ title, subtitle, children, footer, headerSlot }: AuthShellProps) {
  const locale = useLocale();
  const common = useTranslations("common");
  const t = useTranslations("publicAuth");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <BrandLink />
        <Link href={`/${locale}`} className={styles.back}>
          <ArrowLeft size={16} aria-hidden="true" />
          {common("backToHome")}
        </Link>
      </header>
      <main className={styles.layout}>
        <aside className={styles.story}>
          <Image
            src="/images/tenderx-auth-story1.png"
            fill
            alt={t("imageDescription")}
            sizes="(max-width: 900px) 100vw, 60vw"
            priority
            className={styles.artwork}
          />
        </aside>
        <section className={styles.card} aria-labelledby="auth-title">
          <span className={styles.eyebrow}>TenderX Nepal</span>
          <h1 id="auth-title">{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {headerSlot}
          <div className={styles.form}>{children}</div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </section>
      </main>
    </div>
  );
}
