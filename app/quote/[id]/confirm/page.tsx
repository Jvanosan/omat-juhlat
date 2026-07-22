"use client";

import PublicHeader from "@/components/layout/PublicHeader";

import ConfirmationAction from "@/components/quote/confirm/ConfirmationAction";
import ConfirmationHero from "@/components/quote/confirm/ConfirmationHero";
import NextStepsCard from "@/components/quote/confirm/NextStepsCard";
import SelectedServicesSummary from "@/components/quote/confirm/SelectedServicesSummary";

import QuoteEventDetails from "@/components/quote/customer/QuoteEventDetails";
import PublicFooter from "@/components/layout/PublicFooter";
import {
  QuoteAccessDenied,
  QuoteErrorState,
  QuoteLoadingState,
} from "@/components/quote/customer/QuotePageStates";

import { useQuoteConfirmation } from "./useQuoteConfirmation";

export default function ConfirmPage() {
  const {
    loading,
    accessDenied,
    errorMessage,

    quote,
    selectedOffers,
    total,
    alreadyConfirmed,
    confirming,
    quoteHref,

    reload,
    confirmSelections,
  } = useQuoteConfirmation();

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
        <ConfirmationHero
          backHref={quoteHref}
        />

        <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {quote && (
            <QuoteEventDetails
              quote={quote}
            />
          )}

          <NextStepsCard />

          <SelectedServicesSummary
            offers={selectedOffers}
            total={total}
          />

          <ConfirmationAction
            selectedCount={
              selectedOffers.length
            }
            confirming={confirming}
            alreadyConfirmed={
              alreadyConfirmed
            }
            errorMessage={errorMessage}
            backHref={quoteHref}
            onConfirm={() =>
              void confirmSelections()
            }
          />

          <section className="rounded-2xl border border-[#e8ded0] bg-white p-5 text-center">
            <p className="text-sm leading-6 text-[#70675e]">
              OmatJuhlat yhdistää asiakkaat
              luotettaviin juhlapalveluiden
              tarjoajiin. Jos sinulle herää
              kysymyksiä, olemme apunasi.
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}