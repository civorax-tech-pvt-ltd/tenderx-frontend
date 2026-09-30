"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { X } from "lucide-react";
import styles from "./AdPopup.module.css";

export function AdPopup() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const seen = sessionStorage.getItem("tx_ad_seen");
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function close() {
    sessionStorage.setItem("tx_ad_seen", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={close} aria-label="Close">
          <X size={20} />
        </button>
        <Link href={`/${locale}/register`} onClick={close}>
          <Image
            src="/images/tenderx_adv1.png"
            alt="TenderX Nepal — Prepare Smarter. Partner Better. Bid with Confidence."
            width={900}
            height={506}
            priority
            className={styles.image}
          />
        </Link>
      </div>
    </div>
  );
}
