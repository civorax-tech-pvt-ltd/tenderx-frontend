"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLink } from "./Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function PublicHeader() {
  const t = useTranslations("landing.nav");
  const d = useTranslations("desk");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const scroll = () => setScrolled(scrollY > 80);
    scroll(); addEventListener("scroll", scroll, { passive: true });
    return () => removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const resize = () => { if (innerWidth >= 1024) dialog.current?.close(); };
    addEventListener("resize", resize);
    return () => { document.body.style.overflow = previous; removeEventListener("resize", resize); };
  }, [open]);
  const links = [{ href: `/${locale}#workspace`, label: d("product") }, { href: `/${locale}#how-it-works`, label: d("workflow") }, { href: `/${locale}/tenders`, label: "Tenders" }, { href: `/${locale}/login`, label: t("logIn") }, { href: `/${locale}/register`, label: d("createWorkspace") }];
  return <header className={`desk-header${scrolled ? " is-scrolled" : ""}`}>
    <a href="#main" className="desk-skip">{d("skip")}</a>
    <div className="container-x desk-header-inner"><BrandLink />
      <nav aria-label={d("navigation")} className="desk-nav"><Link href={`/${locale}#workspace`}>{d("product")}</Link><Link href={`/${locale}#how-it-works`}>{d("workflow")}</Link><Link href={`/${locale}/tenders`}>Tenders</Link><span className="desk-nav-divider" /><LanguageSwitcher /><Link href={`/${locale}/login`}>{t("logIn")}</Link><Link href={`/${locale}/register`} className="desk-nav-cta">{d("createWorkspace")}<span><ArrowRight size={17} /></span></Link></nav>
      <button className="desk-menu-button" ref={trigger} aria-label={t("menu")} aria-expanded={open} onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Menu size={22} /></button>
    </div>
    <dialog className="desk-mobile-menu" ref={dialog} onClose={() => { setOpen(false); trigger.current?.focus(); }}>
      <div className="desk-mobile-top"><BrandLink /><button autoFocus className="desk-menu-button" aria-label={t("close")} onClick={() => dialog.current?.close()}><X size={22} /></button></div>
      <p className="desk-eyebrow">TX / {d("index")}</p>
      <nav aria-label={d("navigation")}>{links.map((link, i) => <Link key={link.href} href={link.href} onClick={() => dialog.current?.close()}><span>0{i + 1}</span>{link.label}<ArrowRight size={22} /></Link>)}</nav>
      <LanguageSwitcher />
    </dialog>
  </header>;
}
