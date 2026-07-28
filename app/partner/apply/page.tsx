import type {
  Metadata,
} from "next";

import PartnerApplyPageClient from "./PartnerApplyPageClient";

const pageDescription =
  "Liity OmatJuhlat-kumppaniksi, esittele juhlapalvelusi ja vastaanota yrityksellesi sopivia tarjouspyyntöjä.";

export const metadata: Metadata = {
  title:
    "Kumppaniksi – Liity juhlapalveluiden verkostoon",

  description: pageDescription,

  alternates: {
    canonical: "/partner/apply",
  },

  openGraph: {
    title:
      "Liity OmatJuhlat-kumppaniksi",
    description: pageDescription,
    url: "/partner/apply",
    siteName: "OmatJuhlat",
    locale: "fi_FI",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "Liity OmatJuhlat-kumppaniksi",
    description: pageDescription,
  },
};

export default function PartnerApplyPage() {
  return <PartnerApplyPageClient />;
}