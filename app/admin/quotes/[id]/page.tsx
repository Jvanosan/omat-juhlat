"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import OfferCard from "@/components/admin/quote-detail/OfferCard";
import QuoteDetailsCard from "@/components/admin/quote-detail/QuoteDetailsCard";

import { useAdminQuoteDetail } from "./useAdminQuoteDetail";

function getQuoteStatusClasses(status: string | null) {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "suljettu":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

    case "käsittelyssä":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";

    case "cancelled":
    case "peruutettu":
      return "border-red-500/30 bg-red-500/10 text-red-300";

    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }
}

function getQuoteStatusLabel(status: string | null) {
  switch (status?.toLowerCase()) {
    case "avoin":
      return "Avoin";

    case "käsittelyssä":
      return "Käsittelyssä";

    case "confirmed":
      return "Vahvistettu";

    case "suljettu":
      return "Suljettu";

    case "cancelled":
    case "peruutettu":
      return "Peruutettu";

    default:
      return status || "Ei statusta";
  }
}

export default function AdminQuoteDetailPage() {
  const params = useParams();

  const rawQuoteId = params.id;
  const quoteId = Array.isArray(rawQuoteId)
    ? rawQuoteId[0]
    : String(rawQuoteId ?? "");

  const {
    quote,
    offers,
    loading,
    errorMessage,
    reload,
  } = useAdminQuoteDetail(quoteId);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              ← Palaa admin-dashboardiin
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tarjouspyynnön tiedot
              </h1>

              {quote && (
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getQuoteStatusClasses(
                    quote.status,
                  )}`}
                >
                  {getQuoteStatusLabel(quote.status)}
                </span>
              )}
            </div>

            <p className="mt-2 text-zinc-400">
              Asiakkaan tiedot ja palveluntarjoajilta saapuneet
              tarjoukset.
            </p>
          </div>

          {!loading && (
            <button
              type="button"
              onClick={() => void reload()}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold transition hover:border-emerald-500 hover:bg-zinc-800"
            >
              Päivitä tiedot
            </button>
          )}
        </header>

        {loading && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
            Ladataan tarjouspyyntöä...
          </div>
        )}

        {!loading && errorMessage && (
          <div
            role="alert"
            className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6"
          >
            <h2 className="font-bold text-red-300">
              Tietojen lataaminen epäonnistui
            </h2>

            <p className="mt-2 text-sm text-red-200">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => void reload()}
              className="mt-5 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              Yritä uudelleen
            </button>
          </div>
        )}

        {!loading && !errorMessage && quote && (
          <div className="space-y-10">
            <QuoteDetailsCard quote={quote} />

            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">
                    Saapuneet tarjoukset
                  </h2>

                  <p className="mt-1 text-sm text-zinc-400">
                    Avaa tarjous nähdäksesi partnerin tarkemmat
                    tiedot.
                  </p>
                </div>

                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300">
                  {offers.length} tarjousta
                </span>
              </div>

              {offers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/60 p-10 text-center">
                  <div className="text-4xl">📭</div>

                  <h3 className="mt-4 text-lg font-bold">
                    Ei vielä tarjouksia
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    Partnerien lähettämät tarjoukset ilmestyvät tähän.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}