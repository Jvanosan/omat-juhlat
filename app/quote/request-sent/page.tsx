import type {
  Metadata,
} from "next";

import Link from "next/link";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

export const metadata: Metadata = {
  title:
    "Tarkista sähköpostisi | OmatJuhlat",
  description:
    "Tarjouspyyntösi on vastaanotettu. Henkilökohtainen linkki lähetettiin sähköpostiisi.",
};

export default function QuoteRequestSentPage() {
  return (
    <>
      <PublicHeader />

      <main className="relative min-h-[70vh] overflow-hidden bg-[#fbf8f2] px-4 py-16 text-[#211b16] sm:px-6 sm:py-24 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#ead8b8]/40 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#d9a8b8]/25 blur-3xl"
        />

        <section className="relative mx-auto max-w-2xl rounded-3xl border border-[#e2d5c4] bg-white p-6 text-center shadow-[0_22px_70px_rgba(73,53,31,0.12)] sm:p-10">
          <div
            aria-hidden="true"
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#b9dfd0] bg-[#edf8f3] text-4xl"
          >
            ✉️
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#9a773b]">
            Tarjouspyyntö vastaanotettu
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Tarkista sähköpostisi
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#70675e]">
            Lähetimme sähköpostiisi
            henkilökohtaisen linkin, jonka
            kautta pääset seuraamaan
            tarjouspyyntöäsi ja myöhemmin
            vertailemaan saapuneita
            tarjouksia.
          </p>

          <div className="mt-7 rounded-2xl border border-[#ead29d] bg-[#fff8e8] p-5 text-left text-sm leading-6 text-[#795a28]">
            <p className="font-bold">
              Sähköpostia ei näy?
            </p>

            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Tarkista roskaposti- ja
                tarjoukset-kansiot.
              </li>

              <li>
                Viestin saapumisessa voi
                kestää muutama minuutti.
              </li>

              <li>
                Henkilökohtaisen linkin voi
                avata vain saamastasi
                sähköpostista.
              </li>
            </ul>
          </div>

          <div className="mt-7 rounded-2xl border border-[#d7e1ef] bg-[#f3f7fc] p-4 text-sm leading-6 text-[#4c627e]">
            Säilytä sähköpostiviesti. Saman
            linkin kautta voit palata
            tarjouksiisi myöhemmin.
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#b48a45] px-6 py-3 font-bold text-white transition hover:bg-[#9f783a]"
            >
              Takaisin etusivulle
            </Link>

            <a
              href="mailto:info@omatjuhlat.fi"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8c7ad] bg-white px-6 py-3 font-bold text-[#795a28] transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
            >
              Ota yhteyttä
            </a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}