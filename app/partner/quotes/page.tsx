"use client";

import EmptyState from "@/components/partner/EmptyState";
import SectionHeader from "@/components/partner/SectionHeader";

import CategoryRequestCard from "@/components/partner/quotes/CategoryRequestCard";
import DirectRequestCard from "@/components/partner/quotes/DirectRequestCard";

import { usePartnerQuotes } from "./usePartnerQuotes";

export default function PartnerQuotesPage() {
  const {
    loading,
    errorMessage,
    directRequests,
    categoryRequests,
    expandedCard,
    draft,
    savingOffer,
    minimumOfferExpiry,
    hasAnyRequests,
    toggleDirectEditor,
    toggleCategoryEditor,
    closeEditor,
    saveDirectOffer,
    saveCategoryOffer,
    setDraftPrice,
    setDraftMessage,
    setDraftExpiry,
  } = usePartnerQuotes();

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <SectionHeader
        title="Tarjouspyynnöt"
        description="Katso asiakkaiden tarjouspyynnöt ja hallitse lähettämiäsi tarjouksia."
      />

      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200"
        >
          {errorMessage}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <p className="text-sm text-zinc-400">
            Ladataan tarjouspyyntöjä...
          </p>
        </div>
      )}

      {!loading &&
        !errorMessage &&
        !hasAnyRequests && (
          <EmptyState
            icon="📨"
            title="Ei vielä tarjouspyyntöjä"
            description="Kun asiakkaat lähettävät yrityksellesi sopivia tarjouspyyntöjä, ne näkyvät täällä."
          />
        )}

      {!loading &&
        directRequests.length > 0 && (
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold">
                Suorat tarjouspyynnöt
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Asiakkaat ovat valinneet yrityksesi
                itse Browse-sivulta.
              </p>
            </div>

            {directRequests.map((request) => {
              const cardId =
                `direct:${request.id}`;

              return (
                <DirectRequestCard
                  key={request.id}
                  request={request}
                  expanded={
                    expandedCard === cardId
                  }
                  draft={draft}
                  minimumExpiry={
                    minimumOfferExpiry
                  }
                  saving={savingOffer}
                  onToggle={() =>
                    toggleDirectEditor(request)
                  }
                  onCancel={closeEditor}
                  onPriceChange={
                    setDraftPrice
                  }
                  onMessageChange={
                    setDraftMessage
                  }
                  onExpiryChange={
                    setDraftExpiry
                  }
                  onSubmit={() =>
                    void saveDirectOffer(
                      request
                    )
                  }
                />
              );
            })}
          </section>
        )}

      {!loading &&
        categoryRequests.length > 0 && (
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold">
                Kategoriapohjaiset
                tarjouspyynnöt
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Järjestelmä on kohdistanut nämä
                pyynnöt yrityksellesi.
              </p>
            </div>

            {categoryRequests.map((request) => {
              const cardId =
                `category:${request.quotePartnerId}`;

              return (
                <CategoryRequestCard
                  key={request.quotePartnerId}
                  request={request}
                  expanded={
                    expandedCard === cardId
                  }
                  draft={draft}
                  minimumExpiry={
                    minimumOfferExpiry
                  }
                  saving={savingOffer}
                  onToggle={() =>
                    toggleCategoryEditor(request)
                  }
                  onCancel={closeEditor}
                  onPriceChange={
                    setDraftPrice
                  }
                  onMessageChange={
                    setDraftMessage
                  }
                  onExpiryChange={
                    setDraftExpiry
                  }
                  onSubmit={() =>
                    void saveCategoryOffer(
                      request
                    )
                  }
                />
              );
            })}
          </section>
        )}
    </div>
  );
}