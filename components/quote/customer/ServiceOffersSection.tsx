"use client";

import CustomerOfferCard from "./CustomerOfferCard";

import type {
  CustomerOffer,
  OfferSortOption,
  OffersByService,
} from "./types";

import {
  isSelectedOffer,
  sortOffers,
} from "./quoteUtils";

type ServiceOffersSectionProps = {
  offersByService: OffersByService;
  sortBy: OfferSortOption;
  selectingOfferId: string | null;
  removingOfferId: string | null;

  onSelectOffer: (
    offer: CustomerOffer,
  ) => void;

  onRemoveOffer: (
    offer: CustomerOffer,
  ) => void;
};

export default function ServiceOffersSection({
  offersByService,
  sortBy,
  selectingOfferId,
  removingOfferId,
  onSelectOffer,
  onRemoveOffer,
}: ServiceOffersSectionProps) {
  const serviceGroups =
    Object.entries(
      offersByService,
    );

  if (serviceGroups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {serviceGroups.map(
        ([service, offers]) => {
          const sortedOffers =
            sortOffers(
              offers,
              sortBy,
            );

          const selectedOffer =
            offers.find(
              isSelectedOffer,
            );

          const selectedOfferId =
            selectedOffer
              ? String(
                  selectedOffer.id,
                )
              : null;

          return (
            <section key={service}>
              <div className="mb-6 flex flex-col gap-4 border-b border-[#ded3c4] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
                    Palvelukategoria
                  </p>

                  <h2 className="mt-2 text-2xl font-bold capitalize text-[#211b16] sm:text-3xl">
                    {service}
                  </h2>

                  {selectedOffer && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#b9dfd0] bg-[#edf8f3] px-3 py-1.5 text-xs font-bold text-[#11634d]">
                      <span
                        aria-hidden="true"
                      >
                        ✓
                      </span>

                      Alustava valinta tehty
                    </div>
                  )}
                </div>

                <div className="sm:text-right">
                  <p className="text-sm font-semibold text-[#70675e]">
                    {offers.length}{" "}
                    {offers.length === 1
                      ? "tarjous"
                      : "tarjousta"}
                  </p>

                  {selectedOffer && (
                    <p className="mt-1 text-xs text-[#168365]">
                      Voit vielä vaihtaa tai
                      poistaa valinnan
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`grid gap-6 ${
                  sortedOffers.length > 1
                    ? "lg:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {sortedOffers.map(
                  (offer) => (
                    <CustomerOfferCard
                      key={offer.id}
                      offer={offer}
                      selectingOfferId={
                        selectingOfferId
                      }
                      removingOfferId={
                        removingOfferId
                      }
                      serviceHasSelection={
                        selectedOffer !==
                        undefined
                      }
                      selectedOfferId={
                        selectedOfferId
                      }
                      onSelect={
                        onSelectOffer
                      }
                      onRemove={
                        onRemoveOffer
                      }
                    />
                  ),
                )}
              </div>
            </section>
          );
        },
      )}
    </div>
  );
}