"use client";

import PartnerCard from "@/components/partner/PartnerCard";

import OfferForm from "./OfferForm";
import type {
  DirectRequest,
  OfferDraft,
} from "./types";

import {
  formatDate,
  getStatusClasses,
  getStatusLabel,
  isOfferExpired,
isOfferLocked,
toDateInputValue,
} from "./quoteUtils";

type DirectRequestCardProps = {
  request: DirectRequest;
  expanded: boolean;
  draft: OfferDraft;
  minimumExpiry: string;
  saving: boolean;
  onToggle: () => void;
  onCancel: () => void;
  onPriceChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onSubmit: () => void;
};

export default function DirectRequestCard({
  request,
  expanded,
  draft,
  minimumExpiry,
  saving,
  onToggle,
  onCancel,
  onPriceChange,
  onMessageChange,
  onExpiryChange,
  onSubmit,
}: DirectRequestCardProps) {
  const offer = request.directOffer;

  const expired =
  Boolean(offer) &&
  !isOfferLocked(offer?.status ?? null) &&
  isOfferExpired(offer?.expires_at ?? null);

const displayedStatus = expired
  ? "expired"
  : offer?.status ?? request.status;

const locked = offer
  ? isOfferLocked(offer.status) || expired
  : false;

const editing = Boolean(offer) && !locked;

  return (
    <PartnerCard>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-300">
              Suora pyyntö
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                displayedStatus
              )}`}
            >
              {getStatusLabel(displayedStatus)}
            </span>
          </div>

          <h3 className="text-xl font-semibold">
            {request.event_type || "Tapahtuma"}
          </h3>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-zinc-500">
                Päivämäärä
              </p>
              <p className="mt-1 text-zinc-200">
                {formatDate(request.event_date)}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">
                Vierasmäärä
              </p>
              <p className="mt-1 text-zinc-200">
                {request.guests
                  ? `${request.guests} henkilöä`
                  : "Ei ilmoitettu"}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">
                Sijainti
              </p>
              <p className="mt-1 text-zinc-200">
                {request.location || "Ei ilmoitettu"}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">
                Budjetti
              </p>
              <p className="mt-1 text-zinc-200">
                {request.budget || "Ei ilmoitettu"}
              </p>
            </div>
          </div>

          {request.services && (
            <div className="mt-5">
              <p className="text-sm text-zinc-500">
                Pyydetyt palvelut
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                {request.services}
              </p>
            </div>
          )}

          {request.notes && (
            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-sm text-zinc-500">
                Lisätiedot
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">
                {request.notes}
              </p>
            </div>
          )}

          {offer && (
            <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="text-sm font-semibold text-blue-200">
                Lähettämäsi tarjous
              </p>

              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <p className="text-zinc-200">
                  <strong>Hinta:</strong>{" "}
                  {offer.price} €
                </p>

                <p className="text-zinc-200">
                  <strong>Voimassa:</strong>{" "}
                  {formatDate(
                    toDateInputValue(
                      offer.expires_at
                    )
                  )}
                </p>
              </div>

              {offer.message && (
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-300">
                  {offer.message}
                </p>
              )}
            </div>
          )}
        </div>

        {!locked && (
          <button
            type="button"
            onClick={onToggle}
            className={`inline-flex shrink-0 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
              editing
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {expanded
              ? "Sulje"
              : editing
                ? "Muokkaa tarjousta"
                : "Lähetä tarjous"}
          </button>
        )}
      </div>

      {expanded && !locked && (
        <OfferForm
          draft={draft}
          minimumExpiry={minimumExpiry}
          editing={editing}
          saving={saving}
          onPriceChange={onPriceChange}
          onMessageChange={onMessageChange}
          onExpiryChange={onExpiryChange}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      )}
    </PartnerCard>
  );
}