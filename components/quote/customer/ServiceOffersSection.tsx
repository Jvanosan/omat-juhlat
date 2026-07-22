"use client";

import CustomerOfferCard from "./CustomerOfferCard";

import type {
  CustomerOffer,
  OfferSortOption,
  OffersByService,
} from "./types";

import {
  sortOffers,
} from "./quoteUtils";

export default function ServiceOffersSection({
  offersByService,
  sortBy,
  selectingOfferId,
  onSelectOffer,
}: {
  offersByService: OffersByService;
  sortBy: OfferSortOption;
  selectingOfferId: string | null;
  onSelectOffer: (
    offer: CustomerOffer,
  ) => void;
}) {
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

          return (
            <section key={service}>
              <div className="mb-6 flex flex-col gap-2 border-b border-[#ded3c4] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
                    Palvelukategoria
                  </p>

                  <h2 className="mt-2 text-2xl font-bold capitalize text-[#211b16] sm:text-3xl">
                    {service}
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
                      onSelect={
                        onSelectOffer
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