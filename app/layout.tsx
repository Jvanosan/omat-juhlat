import type {
  Metadata,
  Viewport,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";
import GoogleAnalyticsConsent from "./components/GoogleAnalyticsConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.omatjuhlat.fi",
  ),

  title: {
    default:
      "OmatJuhlat – Juhlapalvelut ja tarjoukset helposti",
    template: "%s | OmatJuhlat",
  },

  description:
    "Löydä juhlatila, catering, valokuvaaja, DJ ja muut juhlapalvelut. Lähetä yksi maksuton tarjouspyyntö ja vertaile tarjouksia helposti.",

  applicationName: "OmatJuhlat",

  keywords: [
    "juhlapalvelut",
    "juhlatila",
    "juhlatilat",
    "catering",
    "pitopalvelu",
    "valokuvaaja",
    "DJ",
    "häät",
    "juhlien järjestäminen",
    "tarjouspyyntö",
  ],

  creator: "OmatJuhlat",
  publisher: "OmatJuhlat",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title:
      "OmatJuhlat – Juhlapalvelut ja tarjoukset helposti",
    description:
      "Löydä juhlatilat, catering, kuvaajat, DJ:t ja muut juhlapalvelut yhdellä maksuttomalla tarjouspyynnöllä.",
    url: "https://www.omatjuhlat.fi",
    siteName: "OmatJuhlat",
    locale: "fi_FI",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "OmatJuhlat – Juhlapalvelut ja tarjoukset helposti",
    description:
      "Löydä juhlapalvelut ja vertaile tarjouksia helposti yhdellä tarjouspyynnöllä.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf8f2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="fi"
  data-scroll-behavior="smooth"
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
      <body className="flex min-h-full flex-col">
        <GoogleAnalyticsConsent />
        {children}
      </body>
    </html>
  );
}