import type {
  Metadata,
  Viewport,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

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
  title: {
    default: "OmatJuhlat – Löydä palvelut juhlaasi",
    template: "%s | OmatJuhlat",
  },
  description:
    "Löydä juhlatilat, catering, kuvaajat, DJ:t ja muut juhlapalvelut yhdellä tarjouspyynnöllä.",
  applicationName: "OmatJuhlat",
  keywords: [
    "juhlapalvelut",
    "juhlatilat",
    "catering",
    "DJ",
    "valokuvaaja",
    "häät",
    "juhlat",
  ],
  openGraph: {
    title: "OmatJuhlat",
    description:
      "Suunnittele juhlasi ja vertaile palveluntarjoajien tarjouksia helposti.",
    locale: "fi_FI",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}