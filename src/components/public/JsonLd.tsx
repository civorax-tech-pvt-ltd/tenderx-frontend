export function JsonLd({ locale }: { locale: string }) {
  const isNepali = locale === "ne";
  const name = isNepali ? "टेन्डरएक्स नेपाल" : "TenderX Nepal";
  const alternateNames = [
    "TenderX",
    "TenderX Nepal",
    "Tender X Nepal",
    "Tender Nepal",
    "TenderX Itahari",
    "TenderX Itari",
    "टेन्डरएक्स",
    "टेन्डरएक्स नेपाल",
    "टेन्डर एक्स नेपाल",
    "टेन्डर नेपाल",
    "टेन्डरएक्स इटहरी",
    "टेन्डर इटारी",
  ];
  const keywords =
    "tenderx, tenderxnepal, tender x nepal, tender nepal, tenderx itahari, tenderx itari, tender in nepal, nepali tender, टेन्डरएक्स, टेन्डरएक्स नेपाल, टेन्डर एक्स नेपाल, टेन्डर नेपाल, टेन्डरएक्स इटहरी, टेन्डर इटारी, e-gp nepal tender";

  const description = isNepali
    ? "टेन्डरएक्स नेपाल (TenderX Nepal / tenderx itahari) — नेपाली ठेकेदारहरूका लागि इटहरी तथा नेपालभरि संयुक्त उपक्रम (JV) बोलपत्र, साझेदार व्यवस्थापन, डिजिटल हस्ताक्षर र कागजात तयारीको आधिकारिक डिजिटल कार्यस्थल।"
    : "TenderX Nepal (tenderx / tender x nepal) — Joint venture bidding, tender preparation, partner profiles, and e-GP documentation workspace for Nepali contractors based in Itahari, Nepal.";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://tenderxnepal.com/#organization",
        name: "TenderX Nepal",
        alternateName: alternateNames,
        url: "https://tenderxnepal.com",
        logo: {
          "@type": "ImageObject",
          url: "https://tenderxnepal.com/logo.png",
          width: 321,
          height: 211,
        },
        description:
          "TenderX Nepal provides joint-venture tender preparation software and digital bid desk solutions for Nepali contractors.",
        keywords,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Itahari",
          addressRegion: "Koshi Province",
          addressCountry: "NP",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 26.6646,
          longitude: 87.2798,
        },
        areaServed: [
          {
            "@type": "City",
            name: "Itahari",
          },
          {
            "@type": "Country",
            name: "Nepal",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://tenderxnepal.com/#website",
        url: "https://tenderxnepal.com",
        name: name,
        alternateName: alternateNames,
        description: description,
        keywords,
        publisher: {
          "@id": "https://tenderxnepal.com/#organization",
        },
        inLanguage: ["en", "ne"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://tenderxnepal.com/#software",
        name: name,
        alternateName: alternateNames,
        url: `https://tenderxnepal.com/${locale}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        description: description,
        keywords,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "NPR",
          availability: "https://schema.org/InStock",
        },
        author: {
          "@id": "https://tenderxnepal.com/#organization",
        },
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
