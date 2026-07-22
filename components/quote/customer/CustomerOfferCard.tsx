"use client";

import type {
  CustomerOffer,
} from "./types";

import {
  formatOfferExpiry,
  formatOfferPrice,
  getPartnerImages,
  isOfferExpired,
  isSelectableOffer,
  isSelectedOffer,
} from "./quoteUtils";

export default function CustomerOfferCard({
  offer,
  selectingOfferId,
  onSelect,
}: {
  offer: CustomerOffer;
  selectingOfferId: string | null;
  onSelect: (
    offer: CustomerOffer,
  ) => void;
}) {
  const selected =
    isSelectedOffer(offer);

  const expired = isOfferExpired(
    offer.expires_at,
  );

  const selectable =
    isSelectableOffer(offer);

  const images = getPartnerImages(
    offer.partner?.images,
  );

  const companyName =
    offer.partner?.company ||
    "Palveluntarjoaja";

  const rating =
    offer.partner?.averageRating;

  const reviewCount =
    offer.partner?.reviewCount ?? 0;

  const selecting =
  selectingOfferId ===
  String(offer.id);

  const anotherOfferSelecting =
    selectingOfferId !== null &&
    !selecting;

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-white transition ${
        selected
          ? "border-[#72bca2] shadow-[0_18px_50px_rgba(22,131,101,0.14)] ring-2 ring-[#b9dfd0]"
          : expired
            ? "border-[#edcaca] opacity-85"
            : "border-[#e8ded0] shadow-[0_14px_40px_rgba(73,53,31,0.08)] hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(73,53,31,0.12)]"
      }`}
    >
      {images.length > 0 ? (
        <div className="relative">
          <img
            src={images[0]}
            alt={`${companyName} – tarjouskuva`}
            loading="lazy"
            className={`h-52 w-full object-cover sm:h-64 ${
              expired
                ? "grayscale-[35%]"
                : ""
            }`}
          />

          {images.length > 1 && (
            <span className="absolute bottom-3 left-3 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold text-[#51463d] shadow-sm backdrop-blur">
              📷 {images.length} kuvaa
            </span>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {selected && (
              <StatusBadge
                label="✓ Valittu"
                classes="border-[#72bca2] bg-[#168365] text-white"
              />
            )}

            {expired && !selected && (
              <StatusBadge
                label="Vanhentunut"
                classes="border-[#edcaca] bg-[#fff0f0] text-[#a33d3d]"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#f6ecdc] to-[#f5e8ea]">
          <div className="text-center">
            <div
              aria-hidden="true"
              className="text-4xl"
            >
              ✨
            </div>

            <p className="mt-2 text-sm font-medium text-[#91877d]">
              Ei vielä kuvia
            </p>
          </div>

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {selected && (
              <StatusBadge
                label="✓ Valittu"
                classes="border-[#72bca2] bg-[#168365] text-white"
              />
            )}

            {expired && !selected && (
              <StatusBadge
                label="Vanhentunut"
                classes="border-[#edcaca] bg-[#fff0f0] text-[#a33d3d]"
              />
            )}
          </div>
        </div>
      )}

      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a773b]">
              Palveluntarjoaja
            </p>

            <h3 className="mt-2 break-words text-2xl font-bold text-[#211b16]">
              {companyName}
            </h3>

            {rating ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className="text-lg text-[#e0a321]"
                >
                  ★
                </span>

                <span className="font-bold text-[#3f362f]">
                  {rating} / 5
                </span>

                <span className="text-[#91877d]">
                  ({reviewCount}{" "}
                  {reviewCount === 1
                    ? "arvostelu"
                    : "arvostelua"}
                  )
                </span>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#91877d]">
                Ei vielä arvosteluja
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-2xl border border-[#d5e8df] bg-[#f1faf6] px-5 py-4 sm:text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-[#5c7c70]">
              Tarjouksen hinta
            </p>

            <p className="mt-1 text-3xl font-black text-[#168365]">
              {formatOfferPrice(
                offer.offer_price,
              )}
            </p>
          </div>
        </div>

        {offer.offer_message && (
          <div className="mt-6 rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
              Palveluntarjoajan viesti
            </p>

            <p className="mt-3 whitespace-pre-line leading-7 text-[#51463d]">
              “{offer.offer_message}”
            </p>
          </div>
        )}

        {offer.expires_at && (
          <div
            className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold ${
              expired
                ? "border-[#edcaca] bg-[#fff0f0] text-[#a33d3d]"
                : "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]"
            }`}
          >
            <span aria-hidden="true">
              {expired ? "⌛" : "📅"}
            </span>

            <p>
              {expired
                ? `Tarjous vanhentui ${formatOfferExpiry(
                    offer.expires_at,
                  )}.`
                : `Tarjous on voimassa ${formatOfferExpiry(
                    offer.expires_at,
                  )} asti.`}
            </p>
          </div>
        )}

        {selected && (
          <div className="mt-5 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-4 text-sm font-semibold text-[#11634d]">
            ✓ Olet valinnut tämän tarjouksen.
          </div>
        )}

        {selectable && !selected && (
          <button
            type="button"
            onClick={() =>
              onSelect(offer)
            }
            disabled={
              selectingOfferId !== null
            }
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f783a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selecting
              ? "Valitaan tarjousta..."
              : anotherOfferSelecting
                ? "Odota hetki..."
                : "Valitse tämä tarjous"}
          </button>
        )}

        {expired && !selected && (
          <p className="mt-5 text-center text-sm font-semibold text-[#a33d3d]">
            Tätä tarjousta ei voi enää valita.
          </p>
        )}
      </div>
    </article>
  );
}

function StatusBadge({
  label,
  classes,
}: {
  label: string;
  classes: string;
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm ${classes}`}
    >
      {label}
    </span>
  );
}