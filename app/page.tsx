import type {
  Metadata,
} from "next";

import HomePageClient from "./HomePageClient";

const SITE_URL =
  "https://www.omatjuhlat.fi";

const pageDescription =
  "Löydä juhlatilat, catering, valokuvaajat, DJ:t ja muut juhlapalvelut. Lähetä yksi maksuton tarjouspyyntö ja vertaile tarjouksia helposti.";

export const metadata: Metadata = {
  title:
    "Juhlapalvelut ja tarjoukset helposti",

  description: pageDescription,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "OmatJuhlat – Juhlapalvelut ja tarjoukset helposti",
    description: pageDescription,
    url: "/",
    siteName: "OmatJuhlat",
    locale: "fi_FI",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "OmatJuhlat – Juhlapalvelut ja tarjoukset helposti",
    description: pageDescription,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "OmatJuhlat",
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "OmatJuhlat",
      description: pageDescription,
      inLanguage: "fi-FI",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        id="omatjuhlat-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <HomePageClient />
    </>
  );
}