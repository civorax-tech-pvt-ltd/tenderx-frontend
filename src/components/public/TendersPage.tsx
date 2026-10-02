"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Search, Calendar, Building2, ExternalLink, Newspaper, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import styles from "./TendersPage.module.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Tender {
  id: string;
  title: string;
  organization: string;
  category: string | null;
  district: string | null;
  budget: string | null;
  source: "ppmo" | "newspaper";
  source_url: string | null;
  newspaper_name: string | null;
  publication_date: string | null;
  submission_deadline: string | null;
  is_verified: boolean;
}

interface TenderList {
  items: Tender[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

function fmt(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function deadline_class(dateStr: string | null): string {
  if (!dateStr) return "";
  const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (days < 0) return styles.expired;
  if (days <= 3) return styles.urgent;
  return "";
}

export function TendersPage() {
  const locale = useLocale();
  const [data, setData] = useState<TenderList | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), page_size: "20" });
    if (search) params.set("q", search);
    if (source) params.set("source", source);

    const res = await fetch(`${API}/tenders?${params}`);
    const json: TenderList = await res.json();
    setData(json);
    setLoading(false);
  }, [page, search, source]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(q);
    setPage(1);
  }

  return (
    <div className={styles.page}>
      <PublicHeader />
      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>NEPAL TENDER NOTICES</p>
          <h1>Latest Tender Notices</h1>
          <p className={styles.sub}>
            Government e-GP and newspaper tenders, updated daily.
          </p>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <Search size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, organization…"
            />
            <button type="submit">Search</button>
          </form>

          <div className={styles.filters}>
            <button
              className={source === "" ? styles.active : ""}
              onClick={() => { setSource(""); setPage(1); }}
            >
              All Sources
            </button>
            <button
              className={source === "ppmo" ? styles.active : ""}
              onClick={() => { setSource("ppmo"); setPage(1); }}
            >
              <Globe size={14} /> e-GP / PPMO
            </button>
            <button
              className={source === "newspaper" ? styles.active : ""}
              onClick={() => { setSource("newspaper"); setPage(1); }}
            >
              <Newspaper size={14} /> Newspapers
            </button>
          </div>
        </div>

        <div className={styles.container}>
          {loading && <p className={styles.loading}>Loading tenders…</p>}

          {!loading && data && data.total === 0 && (
            <p className={styles.empty}>No tenders found. Try a different search.</p>
          )}

          {!loading && data && data.items.length > 0 && (
            <>
              <p className={styles.count}>{data.total} tender{data.total !== 1 ? "s" : ""} found</p>
              <ul className={styles.list}>
                {data.items.map((t) => (
                  <li key={t.id} className={styles.card}>
                    <div className={styles.cardTop}>
                      <span className={`${styles.badge} ${t.source === "ppmo" ? styles.ppmo : styles.news}`}>
                        {t.source === "ppmo" ? <Globe size={12} /> : <Newspaper size={12} />}
                        {t.source === "ppmo" ? "e-GP" : t.newspaper_name ?? "Newspaper"}
                      </span>
                      {t.category && <span className={styles.cat}>{t.category}</span>}
                      {t.district && <span className={styles.cat}>{t.district}</span>}
                    </div>

                    <h2 className={styles.title}>{t.title}</h2>

                    <div className={styles.meta}>
                      {t.organization && (
                        <span><Building2 size={14} />{t.organization}</span>
                      )}
                      {t.publication_date && (
                        <span><Calendar size={14} />Published: {fmt(t.publication_date)}</span>
                      )}
                      {t.submission_deadline && (
                        <span className={deadline_class(t.submission_deadline)}>
                          <Calendar size={14} />Deadline: {fmt(t.submission_deadline)}
                        </span>
                      )}
                      {t.budget && <span>Budget: {t.budget}</span>}
                    </div>

                    <div className={styles.cardActions}>
                      {t.source_url && (
                        <a href={t.source_url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                          View original <ExternalLink size={13} />
                        </a>
                      )}
                      <Link href={`/${locale}/register`} className={styles.ctaLink}>
                        Prepare your bid →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>

              {data.pages > 1 && (
                <div className={styles.pagination}>
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <span>Page {page} of {data.pages}</span>
                  <button disabled={page === data.pages} onClick={() => setPage(p => p + 1)}>
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
