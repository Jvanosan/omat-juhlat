"use client";

import PartnerCard from "@/components/partner/PartnerCard";

import CustomerContactCard from "./CustomerContactCard";
import OfferForm from "./OfferForm";

import {
  formatOfferPrice,
  LockedOfferMessage,
  OfferDetailItem,
} from "./OfferCardElements";

import {
  isPastRequestDate,
} from "./requestFilters";

import {
  formatDate,
  getStatusClasses,
  getStatusLabel,
  isOfferExpired,
  isOfferLocked,
  toDateInputValue,
} from "./quoteUtils";

import type {
  DirectRequest,
  OfferDraft,
} from "./types";

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
  const offer =
    request.directOffer;

  const hasOffer =
    Boolean(offer);

  const pastRequest =
    isPastRequestDate(
      request.event_date,
    );

  const offerExpired =
    hasOffer &&
    !isOfferLocked(
      offer?.status ?? null,
    ) &&
    isOfferExpired(
      offer?.expires_at ?? null,
    );

  const displayedStatus =
    pastRequest && !offer
      ? "expired"
      : offerExpired
        ? "expired"
        : offer?.status ??
          request.status;

  /*
   * Menneeseen tapahtumaan ei voi enää
   * lähettää tai muokata tarjousta.
   */
  const locked =
    pastRequest ||
    (
      offer
        ? isOfferLocked(
            offer.status,
          ) ||
          offerExpired
        : false
    );

  const editing =
    Boolean(offer) && !locked;

  const normalizedOfferStatus =
    offer?.status
      ?.trim()
      .toLowerCase() ?? "";

  const normalizedRequestStatus =
    request.status
      ?.trim()
      .toLowerCase() ?? "";

  const customerContactAvailable =
    normalizedOfferStatus ===
      "accepted" &&
    normalizedRequestStatus ===
      "accepted";

  const hasBudget =
    request.budget !== null &&
    request.budget !== undefined &&
    String(
      request.budget,
    ).trim() !== "";

  return (
    <PartnerCard
      as="article"
      className={`transition ${
        pastRequest
          ? "border-[#aaa6a1]! bg-[#e7e5e2]! grayscale"
          : expanded
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

            {pastRequest && (
              <span className="rounded-full border border-[#68635e] bg-[#68635e] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Tapahtuma päättynyt
              </span>
            )}
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
              label="Koko tapahtuman budjetti"
              value={
                hasBudget
                  ? formatOfferPrice(
                      request.budget,
                    )
                  : "Ei ilmoitettu"
              }
              icon="💶"
            />
          </dl>

          {hasBudget && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#c9c6c2] bg-[#f1f0ee] p-4 text-sm leading-6 text-[#625e59]">
              <span aria-hidden="true">
                ℹ️
              </span>

              <p>
                <strong>
                  Huomio:
                </strong>{" "}
                Tämä on asiakkaan
                ilmoittama arvio koko
                tapahtuman ja kaikkien
                valittujen palveluiden
                budjetista. Summaa ei ole
                varattu vain sinun
                tarjoamallesi palvelulle.
              </p>
            </div>
          )}

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
            <div className="mt-5 rounded-2xl border border-[#d2cfca] bg-white/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#77716b]">
                Asiakkaan lisätiedot
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#62584f]">
                {request.notes}
              </p>
            </div>
          )}

          {offer && (
            <div className="mt-5 rounded-2xl border border-[#c7c5c2] bg-white/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-bold text-[#3f3b37]">
                  Lähettämäsi tarjous
                </p>

                {!locked && (
                  <span className="text-xs font-semibold text-[#706b65]">
                    Voit vielä muokata
                    tarjousta
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-sm text-[#514c47]">
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
                <p className="mt-3 whitespace-pre-line border-t border-[#d8d5d1] pt-3 text-sm leading-6 text-[#5d5853]">
                  {offer.message}
                </p>
              )}
            </div>
          )}

          {pastRequest ? (
            <div className="mt-5 rounded-2xl border border-[#b9b6b2] bg-[#d8d6d3] p-4 text-sm font-semibold text-[#514d48]">
              Tämä tapahtuma on päättynyt.
              Tarjousta ei voi enää muokata.
            </div>
          ) : (
            locked && (
              <LockedOfferMessage
                status={
                  displayedStatus
                }
              />
            )
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