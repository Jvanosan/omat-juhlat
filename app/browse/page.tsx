import type {
  Metadata,
} from "next";

import BrowsePageClient from "./BrowsePageClient";

const pageDescription =
  "Selaa ja vertaile juhlatiloja, catering-palveluita, valokuvaajia, DJ-palveluita ja muita juhlapalveluja. Lähetä tarjouspyyntö valitsemillesi yrityksille.";

export const metadata: Metadata = {
  title:
    "Selaa juhlapalveluita ja palveluntarjoajia",

  description: pageDescription,

  alternates: {
    canonical: "/browse",
  },

  openGraph: {
    title:
      "Selaa juhlapalveluita | OmatJuhlat",
    description: pageDescription,
    url: "/browse",
    siteName: "OmatJuhlat",
    locale: "fi_FI",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "Selaa juhlapalveluita | OmatJuhlat",
    description: pageDescription,
  },
};

export default function BrowsePage() {
  return <BrowsePageClient />;
}