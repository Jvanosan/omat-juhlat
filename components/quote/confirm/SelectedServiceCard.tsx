import type {
  CustomerOffer,
} from "@/components/quote/customer/types";

import {
  formatOfferPrice,
  getPartnerImages,
} from "@/components/quote/customer/quoteUtils";

export default function SelectedServiceCard({
  offer,
}: {
  offer: CustomerOffer;
}) {
  const images = getPartnerImages(
    offer.partner?.images,
  );

  const companyName =
    offer.partner?.company ||
    "Palveluntarjoaja";

  return (
    <article className="overflow-hidden rounded-3xl border border-[#b9dfd0] bg-white shadow-sm">
      {images[0] ? (
        <img
          src={images[0]}
          alt={`${companyName} – palveluntarjoajan kuva`}
          loading="lazy"
          className="h-48 w-full object-cover sm:h-56"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#f6ecdc] to-[#f5e8ea]">
          <div className="text-center">
            <div
              aria-hidden="true"
              className="text-4xl"
            >
              ✨
            </div>

            <p className="mt-2 text-sm text-[#91877d]">
              Ei vielä kuvaa
            </p>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#b9dfd0] bg-[#edf8f3] px-3 py-1 text-xs font-bold text-[#11634d]">
            ✓ Valittu
          </span>

          {offer.service && (
            <span className="rounded-full border border-[#e5d8c5] bg-[#fff9ef] px-3 py-1 text-xs font-bold capitalize text-[#795a28]">
              {offer.service}
            </span>
          )}
        </div>

        <h3 className="mt-4 break-words text-2xl font-bold text-[#211b16]">
          {companyName}
        </h3>

        <div className="mt-4 rounded-2xl border border-[#d5e8df] bg-[#f1faf6] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#5c7c70]">
            Valittu hinta
          </p>

          <p className="mt-1 text-3xl font-black text-[#168365]">
            {formatOfferPrice(
              offer.offer_price,
            )}
          </p>
        </div>

        {offer.offer_message && (
          <div className="mt-4 rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
              Palveluntarjoajan viesti
            </p>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#51463d]">
              “{offer.offer_message}”
            </p>
          </div>
        )}
      </div>
    </article>
  );
}