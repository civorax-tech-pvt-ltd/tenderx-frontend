import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TenderX Nepal (टेन्डरएक्स नेपाल) — Tender & JV Bid Workspace | Itahari",
    short_name: "TenderX Nepal",
    description:
      "TenderX Nepal (tenderx itahari) — Prepare joint-venture tenders and bids with partner details, signatures, and reusable company profiles.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#1e293b",
    icons: [
      {
        src: "/logo.png",
        sizes: "321x211",
        type: "image/png",
      },
    ],
  };
}
