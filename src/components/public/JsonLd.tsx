const SITE_URL = "https://tenderxnepal.com";

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
    "tenderxnepal",
    "टेन्डरएक्स",
    "टेन्डरएक्स नेपाल",
    "टेन्डर एक्स नेपाल",
    "टेन्डर नेपाल",
    "टेन्डरएक्स इटहरी",
    "टेन्डर इटारी",
  ];

  const keywords =
    "tender nepal, bolpatra, ppmo nepal, e-gp nepal, ppmo e-gp, bid nepal, bolpatra nepal, tender notice nepal, joint venture nepal, jv bid nepal, contractor nepal, tenderx, tenderxnepal, tender x nepal, tenderx itahari, tender in nepal, nepali tender, itahari tender, government tender nepal, tender preparation nepal, e-gp bid submission, बोलपत्र, टेन्डर नेपाल, ppmo नेपाल, e-gp नेपाल, बोलपत्र तयारी, संयुक्त उपक्रम नेपाल";

  const description = isNepali
    ? "टेन्डरएक्स नेपाल — बोलपत्र तयारी, PPMO e-GP टेन्डर सबमिसन, र संयुक्त उपक्रम (JV) बोलपत्र कार्यस्थल। नेपाली ठेकेदारहरूका लागि इटहरी तथा नेपालभरि।"
    : "TenderX Nepal — Nepal's digital workspace for bolpatra (bid documents), PPMO e-GP tenders, and joint venture (JV) bid preparation. Used by Nepali contractors in Itahari and nationwide.";

  const faqs = isNepali
    ? [
        {
          q: "TenderX Nepal के हो?",
          a: "TenderX Nepal (tenderxnepal.com) नेपाली ठेकेदारहरूका लागि बोलपत्र तयारी, PPMO e-GP टेन्डर सबमिसन, र संयुक्त उपक्रम (JV) बोलपत्र कागजात व्यवस्थापन गर्ने डिजिटल कार्यस्थल हो। इटहरी, कोशी प्रदेशमा आधारित।",
        },
        {
          q: "बोलपत्र (bolpatra) भनेको के हो?",
          a: "बोलपत्र (bolpatra) भनेको नेपालमा सरकारी निर्माण वा सेवा ठेक्काका लागि दिइने आधिकारिक निविदा कागजात हो। PPMO e-GP पोर्टलमार्फत इलेक्ट्रोनिक रूपमा पेश गर्न सकिन्छ। TenderX Nepal ले बोलपत्र तयारी सजिलो बनाउँछ।",
        },
        {
          q: "PPMO e-GP भनेको के हो?",
          a: "PPMO e-GP (Public Procurement Monitoring Office — Electronic Government Procurement) नेपाल सरकारको अनलाइन टेन्डर पोर्टल हो। यसमार्फत ठेकेदारहरूले सरकारी टेन्डरहरू हेर्न र बोलपत्र पेश गर्न सक्छन्। TenderX Nepal ले e-GP सबमिसनका लागि कागजात तयार गर्न मद्दत गर्छ।",
        },
        {
          q: "संयुक्त उपक्रम (Joint Venture) बोलपत्र कसरी तयार गर्ने?",
          a: "TenderX Nepal मा दुई वा तीन कम्पनीका प्रोफाइलहरू राखी संयुक्त उपक्रम (JV) बोलपत्र स्वचालित रूपमा तयार गर्न सकिन्छ। साझेदारहरूको विवरण, डिजिटल हस्ताक्षर र कागजातहरू एकै ठाउँमा व्यवस्थापन गर्न सकिन्छ।",
        },
        {
          q: "TenderX Nepal कहाँ अवस्थित छ?",
          a: "TenderX Nepal इटहरी, कोशी प्रदेश, नेपालमा आधारित छ र CivoraX Tech Pvt. Ltd. द्वारा विकसित छ। सेवाका लागि: +977 9705890073।",
        },
      ]
    : [
        {
          q: "What is TenderX Nepal?",
          a: "TenderX Nepal (tenderxnepal.com) is Nepal's digital workspace for bolpatra (bid document) preparation, PPMO e-GP tender submissions, and joint venture (JV) bid management. It helps Nepali contractors in Itahari and across Nepal prepare professional tender documents quickly.",
        },
        {
          q: "What is bolpatra in Nepal?",
          a: "Bolpatra (बोलपत्र) is the Nepali term for a tender bid document submitted to win government construction or service contracts. It includes partner profiles, JV agreements, ownership splits, and authorized signatures. TenderX Nepal automates bolpatra preparation for PPMO e-GP and newspaper tenders.",
        },
        {
          q: "What is PPMO e-GP Nepal?",
          a: "PPMO e-GP (Public Procurement Monitoring Office — Electronic Government Procurement) is Nepal's official online tender portal at ppmo.gov.np. Contractors register and submit bids electronically. TenderX Nepal helps prepare all required bid documents for e-GP submissions.",
        },
        {
          q: "How do I prepare a Joint Venture (JV) bid in Nepal?",
          a: "TenderX Nepal lets you add two or three partner company profiles and automatically generates a complete joint venture bid package — including JV agreement, ownership split, partner details, and authorized signatures — all in one workspace.",
        },
        {
          q: "What tender notices are available on TenderX Nepal?",
          a: "TenderX Nepal aggregates daily tender notices from Nepal's PPMO e-GP portal and national newspapers (Gorkhapatra, Kantipur, Nagarik, Annapurna Post, etc.). You can browse and filter government construction, consulting, and supply tenders from across Nepal.",
        },
        {
          q: "Where is TenderX Nepal located?",
          a: "TenderX Nepal is based in Itahari, Koshi Province, Nepal, and is developed by CivoraX Tech Pvt. Ltd. Contact: +977 9705890073, Email: civoraxt@gmail.com.",
        },
      ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "TenderX Nepal",
        alternateName: alternateNames,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 321,
          height: 211,
        },
        description:
          "TenderX Nepal provides bolpatra (bid document) preparation, PPMO e-GP tender management, and joint-venture bid workspace software for Nepali contractors.",
        keywords,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Itahari",
          addressLocality: "Itahari",
          addressRegion: "Koshi Province",
          addressCountry: "NP",
          postalCode: "56705",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 26.6646,
          longitude: 87.2798,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+977-9705890073",
            contactType: "customer support",
            availableLanguage: ["en", "ne"],
            areaServed: "NP",
          },
          {
            "@type": "ContactPoint",
            telephone: "+977-9862123845",
            contactType: "technical support",
            contactOption: "TollFree",
            availableLanguage: ["ne"],
            areaServed: "NP",
          },
        ],
        email: "civoraxt@gmail.com",
        areaServed: [
          { "@type": "City", name: "Itahari" },
          { "@type": "AdministrativeArea", name: "Koshi Province" },
          { "@type": "Country", name: "Nepal" },
        ],
        sameAs: [
          "https://www.tenderxnepal.com",
        ],
        foundingLocation: {
          "@type": "Place",
          name: "Itahari, Koshi Province, Nepal",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name,
        alternateName: alternateNames,
        description,
        keywords,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["en", "ne"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/en/tenders?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${locale}#webpage`,
        url: `${SITE_URL}/${locale}`,
        name,
        description,
        keywords,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#software` },
        inLanguage: locale === "ne" ? "ne" : "en",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${SITE_URL}/${locale}`,
            },
          ],
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name,
        alternateName: alternateNames,
        url: `${SITE_URL}/${locale}`,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Tender Management Software",
        operatingSystem: "Web Browser",
        description,
        keywords,
        featureList: [
          "Bolpatra (bid document) preparation",
          "PPMO e-GP tender submission documents",
          "Joint Venture (JV) bid management",
          "Partner profile management",
          "Digital signature upload",
          "Nepal tender notices aggregation",
          "Bid readiness checklist",
          "PDF bid document generation",
        ],
        offers: {
          "@type": "Offer",
          priceCurrency: "NPR",
          availability: "https://schema.org/InStock",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
        author: { "@id": `${SITE_URL}/#organization` },
        creator: {
          "@type": "Organization",
          name: "CivoraX Tech Pvt. Ltd.",
          url: "https://www.civorax.com",
        },
        inLanguage: ["en", "ne"],
        isAccessibleForFree: false,
        countriesSupported: "NP",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/${locale}#faq`,
        mainEntity: faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: a,
          },
        })),
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
