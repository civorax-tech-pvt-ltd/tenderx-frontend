import type { Metadata } from "next";
import { TendersPage } from "@/components/public/TendersPage";

export const metadata: Metadata = {
  title: "Tender Notices Nepal | TenderX Nepal",
  description:
    "Browse latest government and newspaper tender notices from Nepal. Updated daily from PPMO e-GP and national newspapers.",
};

export default function Page() {
  return <TendersPage />;
}
