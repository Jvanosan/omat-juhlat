"use client";

import PublicHeader from "@/components/layout/PublicHeader";

import OfferSort from "@/components/quote/customer/OfferSort";
import QuoteEventDetails from "@/components/quote/customer/QuoteEventDetails";
import QuotePageHero from "@/components/quote/customer/QuotePageHero";
import QuoteStats from "@/components/quote/customer/QuoteStats";
import ServiceOffersSection from "@/components/quote/customer/ServiceOffersSection";
import WaitingForOffers from "@/components/quote/customer/WaitingForOffers";
import PublicFooter from "@/components/layout/PublicFooter";
import {
  QuoteAccessDenied,
  QuoteErrorState,
  QuoteLoadingState,
} from "@/components/quote/customer/QuotePageStates";

import { useCustomerQuote } from "./useCustomerQuote";

export default function QuotePage() {
  const {
    loading,
    accessDenied,
    errorMessage,

    quote,
    quoteStatus,

    receivedOffers,
    pendingRequestCount,
    offersByService,
    serviceCount,
    selectableOfferCount,

    sortBy,
    setSortBy,

    selectingOfferId,

    reload,
    selectOffer,
  } = useCustomerQuote();

  if (loading) {
    return (
      <>
        <PublicHeader />
        <QuoteLoadingState />
        <PublicFooter />
      </>
    );
  }

  if (accessDenied) {
    return (
      <>
        <PublicHeader />
        <QuoteAccessDenied />
        <PublicFooter />
      </>
    );
  }

  if (errorMessage && !quote) {
    return (
      <>
        <PublicHeader />

        <QuoteErrorState
          message={errorMessage}
          onRetry={() =>
            void reload()
          }
        />
        <PublicFooter />
      </>
    );
  }

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#fbf8f2] text-[#211b16]">
        <QuotePageHero
          quoteStatus={quoteStatus}
        />

        <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {errorMessage && (
            <div
              role="alert"
              className="flex flex-col gap-4 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-5 text-[#a33d3d] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold">
                  Toiminto epäonnistui
                </p>

                <p className="mt-1 text-sm leading-6">
                  {errorMessage}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void reload()
                }
                className="shrink-0 rounded-xl border border-[#d99e9e] bg-white px-4 py-2 text-sm font-bold text-[#a33d3d] transition hover:bg-[#fff7f7]"
              >
                Päivitä tiedot
              </button>
            </div>
          )}

          {quote && (
            <QuoteEventDetails
              quote={quote}
            />
          )}

          <QuoteStats
            receivedOffers={
              receivedOffers.length
            }
            serviceCount={serviceCount}
            selectableOffers={
              selectableOfferCount
            }
          />

          {(quoteStatus ===
            "confirmed" ||
            quoteStatus ===
              "suljettu") && (
            <div className="flex items-start gap-3 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-5 text-[#11634d]">
              <span
                aria-hidden="true"
                className="text-xl"
              >
                ✓
              </span>

              <div>
                <p className="font-bold">
                  Valintasi on vahvistettu
                </p>

                <p className="mt-1 text-sm leading-6 text-[#41685d]">
                  Palveluntarjoajalle on
                  ilmoitettu valinnasta.
                  Sopiminen ja maksaminen
                  hoidetaan suoraan
                  palveluntarjoajan kanssa.
                </p>
              </div>
            </div>
          )}

          {receivedOffers.length ===
          0 ? (
            <WaitingForOffers
              pendingRequestCount={
                pendingRequestCount
              }
              onRefresh={() =>
                void reload()
              }
            />
          ) : (
            <>
              <OfferSort
                value={sortBy}
                onChange={setSortBy}
              />

              <ServiceOffersSection
                offersByService={
                  offersByService
                }
                sortBy={sortBy}
                selectingOfferId={
                  selectingOfferId
                }
                onSelectOffer={(
                  offer,
                ) =>
                  void selectOffer(
                    offer,
                  )
                }
              />
            </>
          )}

          <div className="rounded-2xl border border-[#e8ded0] bg-white p-5 text-center text-sm leading-6 text-[#70675e]">
            Säilytä sähköpostissa saamasi
            henkilökohtainen linkki. Sen
            kautta voit palata tarjouksiin
            myöhemmin.
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}