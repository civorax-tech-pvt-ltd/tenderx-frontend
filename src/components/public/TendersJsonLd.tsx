const SITE_URL = "https://tenderxnepal.com";

export function TendersJsonLd({ locale }: { locale: string }) {
  const isNepali = locale === "ne";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${locale}/tenders#webpage`,
        url: `${SITE_URL}/${locale}/tenders`,
        name: isNepali
          ? "नेपाल टेन्डर सूचनाहरू — PPMO e-GP तथा अखबार टेन्डर | TenderX Nepal"
          : "Nepal Tender Notices — PPMO e-GP & Newspaper Tenders | TenderX Nepal",
        description: isNepali
          ? "नेपालका ताजा सरकारी टेन्डर सूचनाहरू। PPMO e-GP पोर्टल र राष्ट्रिय अखबारबाट दैनिक अपडेट।"
          : "Latest government and newspaper tender notices from Nepal. Daily updates from PPMO e-GP portal and national newspapers.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: locale === "ne" ? "ne" : "en",
        about: {
          "@type": "Thing",
          name: isNepali ? "नेपाल टेन्डर सूचनाहरू" : "Nepal Tender Notices",
          description: isNepali
            ? "PPMO e-GP र अखबारबाट नेपालका सरकारी टेन्डर सूचनाहरू"
            : "Government tender notices from Nepal PPMO e-GP and national newspapers",
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: isNepali ? "गृहपृष्ठ" : "Home",
              item: `${SITE_URL}/${locale}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: isNepali ? "टेन्डर सूचनाहरू" : "Tender Notices",
              item: `${SITE_URL}/${locale}/tenders`,
            },
          ],
        },
      },
      {
        "@type": "Dataset",
        "@id": `${SITE_URL}/${locale}/tenders#dataset`,
        name: isNepali ? "नेपाल टेन्डर सूचना डेटासेट" : "Nepal Tender Notices Dataset",
        description: isNepali
          ? "PPMO e-GP पोर्टल र नेपाली राष्ट्रिय अखबारहरूबाट दैनिक रूपमा अपडेट हुने टेन्डर सूचनाहरू।"
          : "Daily-updated tender notices aggregated from Nepal's PPMO e-GP portal and national newspapers including Gorkhapatra, Kantipur, Nagarik, and Annapurna Post.",
        url: `${SITE_URL}/${locale}/tenders`,
        creator: { "@id": `${SITE_URL}/#organization` },
        keywords: [
          "tender nepal",
          "ppmo e-gp",
          "nepal tender notice",
          "government tender nepal",
          "bolpatra",
          "bid notice nepal",
          "टेन्डर सूचना",
          "बोलपत्र",
          "ppmo nepal",
        ],
        inLanguage: ["en", "ne"],
        temporalCoverage: "2024/..",
        spatialCoverage: { "@type": "Country", name: "Nepal" },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
