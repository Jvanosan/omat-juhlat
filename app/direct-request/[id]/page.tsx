"use client";

import PublicHeader from "@/components/layout/PublicHeader";

import AcceptedDirectOffer from "@/components/direct-request/customer/AcceptedDirectOffer";
import DirectOfferStats from "@/components/direct-request/customer/DirectOfferStats";
import DirectRequestDetails from "@/components/direct-request/customer/DirectRequestDetails";
import DirectRequestHero from "@/components/direct-request/customer/DirectRequestHero";

import CustomerOfferCard from "@/components/quote/customer/CustomerOfferCard";
import OfferSort from "@/components/quote/customer/OfferSort";
import WaitingForOffers from "@/components/quote/customer/WaitingForOffers";
import PublicFooter from "@/components/layout/PublicFooter";
import {
  QuoteAccessDenied,
  QuoteErrorState,
  QuoteLoadingState,
} from "@/components/quote/customer/QuotePageStates";

import { useDirectRequest } from "./useDirectRequest";

export default function DirectRequestPage() {
  const {
    loading,
    accessDenied,
    errorMessage,

    directRequest,
    offers,
    receivedOfferCount,
    selectableOfferCount,
    acceptedOffer,

    sortBy,
    setSortBy,

    selectingOfferId,

    reload,
    selectOffer,
  } = useDirectRequest();

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

  if (
    errorMessage &&
    !directRequest
  ) {
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
        <DirectRequestHero
          offerAccepted={Boolean(
            acceptedOffer,
          )}
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

          {directRequest && (
            <DirectRequestDetails
              request={directRequest}
            />
          )}

          <DirectOfferStats
            receivedOffers={
              receivedOfferCount
            }
            selectableOffers={
              selectableOfferCount
            }
          />

          {acceptedOffer ? (
            <AcceptedDirectOffer
              offer={acceptedOffer}
            />
          ) : offers.length === 0 ? (
            <WaitingForOffers
              pendingRequestCount={0}
              onRefresh={() =>
                void reload()
              }
            />
          ) : (
            <>
              {offers.length > 1 && (
                <OfferSort
                  value={sortBy}
                  onChange={setSortBy}
                />
              )}

              <section>
                <div className="mb-6 flex flex-col gap-2 border-b border-[#ded3c4] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
                      Vertailu
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#211b16] sm:text-3xl">
                      Saapuneet tarjoukset
                    </h2>
                  </div>

                  <p className="text-sm font-semibold text-[#70675e]">
                    {offers.length}{" "}
                    {offers.length === 1
                      ? "tarjous"
                      : "tarjousta"}
                  </p>
                </div>

                <div
                  className={`grid gap-6 ${
                    offers.length > 1
                      ? "lg:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {offers.map(
                    (offer) => (
                      <CustomerOfferCard
                        key={offer.id}
                        offer={offer}
                        selectingOfferId={
                          selectingOfferId
                        }
                        onSelect={(
                          selectedOffer,
                        ) =>
                          void selectOffer(
                            selectedOffer,
                          )
                        }
                      />
                    ),
                  )}
                </div>
              </section>
            </>
          )}

          <section className="rounded-2xl border border-[#e8ded0] bg-white p-5 text-center">
            <p className="text-sm leading-6 text-[#70675e]">
              Säilytä sähköpostissa saamasi
              henkilökohtainen linkki. Sen
              kautta voit palata tarjouksiin
              myöhemmin.
            </p>

            <p className="mt-2 text-xs leading-5 text-[#91877d]">
              Tarjouspyyntö ei sido sinua
              hyväksymään tarjousta.
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}