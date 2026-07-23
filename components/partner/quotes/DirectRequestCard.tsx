"use client";

import PartnerCard from "@/components/partner/PartnerCard";

import OfferForm from "./OfferForm";
import CustomerContactCard from "./CustomerContactCard";
import {
  formatOfferPrice,
  LockedOfferMessage,
  OfferDetailItem,
} from "./OfferCardElements";

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
  onPriceChange: (
    value: string,
  ) => void;
  onMessageChange: (
    value: string,
  ) => void;
  onExpiryChange: (
    value: string,
  ) => void;
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
    !isOfferLocked(
      offer?.status ?? null,
    ) &&
    isOfferExpired(
      offer?.expires_at ?? null,
    );

  const displayedStatus = expired
    ? "expired"
    : offer?.status ?? request.status;

  const locked = offer
    ? isOfferLocked(offer.status) ||
      expired
    : false;

  const editing =
    Boolean(offer) && !locked;

  const customerContactAvailable =
  offer?.status
    ?.trim()
    .toLowerCase() ===
    "accepted" &&
  request.status
    ?.trim()
    .toLowerCase() ===
    "accepted";

  return (
    <PartnerCard
      as="article"
      className={`transition ${
        expanded
          ? "border-[#d7b775] shadow-[0_16px_40px_rgba(73,53,31,0.1)]"
          : "hover:border-[#d8c7ad]"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#efcdd3] bg-[#fff3f5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#9d5261]">
              Suora pyyntö
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClasses(
                displayedStatus,
              )}`}
            >
              {getStatusLabel(
                displayedStatus,
              )}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#211b16] sm:text-2xl">
            {request.event_type ||
              "Tapahtuma"}
          </h3>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <OfferDetailItem
              label="Päivämäärä"
              value={formatDate(
                request.event_date,
              )}
              icon="📅"
            />

            <OfferDetailItem
              label="Vierasmäärä"
              value={
                request.guests
                  ? `${request.guests} henkilöä`
                  : "Ei ilmoitettu"
              }
              icon="👥"
            />

            <OfferDetailItem
              label="Sijainti"
              value={
                request.location ||
                "Ei ilmoitettu"
              }
              icon="📍"
            />

            <OfferDetailItem
              label="Budjetti"
              value={
                request.budget
                  ? `${request.budget} €`
                  : "Ei ilmoitettu"
              }
              icon="💶"
            />
          </dl>

          {request.services && (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
                Pyydetyt palvelut
              </p>

              <p className="mt-2 leading-6 text-[#62584f]">
                {request.services}
              </p>
            </div>
          )}

          {request.notes && (
            <div className="mt-5 rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
                Asiakkaan lisätiedot
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#62584f]">
                {request.notes}
              </p>
            </div>
          )}

          {offer && (
            <div className="mt-5 rounded-2xl border border-[#cdddf1] bg-[#f1f6fd] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-bold text-[#284f87]">
                  Lähettämäsi tarjous
                </p>

                {!locked && (
                  <span className="text-xs font-semibold text-[#56739a]">
                    Voit vielä muokata
                    tarjousta
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-sm text-[#3f536e]">
                <p>
                  <strong>
                    Hinta:
                  </strong>{" "}
                  {formatOfferPrice(
                    offer.price,
                  )}
                </p>

                <p>
                  <strong>
                    Voimassa:
                  </strong>{" "}
                  {formatDate(
                    toDateInputValue(
                      offer.expires_at,
                    ),
                  )}
                </p>
              </div>

              {offer.message && (
                <p className="mt-3 whitespace-pre-line border-t border-[#dce7f5] pt-3 text-sm leading-6 text-[#4f6178]">
                  {offer.message}
                </p>
              )}
            </div>
          )}

          {locked && (
            <LockedOfferMessage
              status={
                displayedStatus
              }
            />
          )}
          {customerContactAvailable && (
  <CustomerContactCard
    requestType="direct"
    requestId={request.id}
  />
)}
        </div>

        {!locked && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className={`inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 ${
              expanded
                ? "bg-[#62584f] hover:bg-[#493f37]"
                : editing
                  ? "bg-[#3564a8] hover:bg-[#284f87]"
                  : "bg-[#168365] hover:bg-[#116b53]"
            }`}
          >
            {expanded
              ? "Sulje lomake"
              : editing
                ? "Muokkaa tarjousta"
                : "Lähetä tarjous"}
          </button>
        )}
      </div>

      {expanded && !locked && (
        <OfferForm
          draft={draft}
          minimumExpiry={
            minimumExpiry
          }
          editing={editing}
          saving={saving}
          onPriceChange={
            onPriceChange
          }
          onMessageChange={
            onMessageChange
          }
          onExpiryChange={
            onExpiryChange
          }
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      )}
    </PartnerCard>
  );
}