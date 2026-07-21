"use client";

import { useState } from "react";

import type { AdminQuoteOffer } from "./types";

type OfferCardProps = {
  offer: AdminQuoteOffer;
};

function formatDateTime(value: string | null) {
  if (!value) return "Ei ilmoitettu";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fi-FI", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatPartnerServices(
  value: AdminQuoteOffer["partner"] extends infer Partner
    ? Partner extends { services: infer Services }
      ? Services
      : never
    : never,
) {
  if (!value) return "Ei ilmoitettu";
  return Array.isArray(value) ? value.join(", ") : value;
}

function getStatusStyle(status: string | null) {
  switch (status?.toLowerCase()) {
    case "selected":
    case "valittu":
      return "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300";

    case "accepted":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

    case "rejected":
    case "cancelled":
    case "expired":
      return "border-red-500/30 bg-red-500/10 text-red-300";

    case "sent":
    case "offered":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";

    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }
}

function getStatusLabel(status: string | null) {
  switch (status?.toLowerCase()) {
    case "sent":
      return "Lähetetty";
    case "offered":
      return "Tarjous lähetetty";
    case "selected":
    case "valittu":
      return "Asiakas valitsi";
    case "accepted":
      return "Hyväksytty";
    case "rejected":
      return "Hylätty";
    case "cancelled":
      return "Peruutettu";
    case "expired":
      return "Vanhentunut";
    default:
      return status || "Tuntematon";
  }
}

function getImages(value: string[] | string | null | undefined) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);
}

export default function OfferCard({ offer }: OfferCardProps) {
  const [expanded, setExpanded] = useState(false);
  const partner = offer.partner;
  const images = getImages(partner?.images);

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
      <div className="p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                  offer.status,
                )}`}
              >
                {getStatusLabel(offer.status)}
              </span>

              <span className="text-sm text-zinc-500">
                {formatDateTime(offer.created_at)}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              {partner?.company || "Tuntematon palveluntarjoaja"}
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              {offer.service || "Palvelua ei ilmoitettu"}
            </p>
          </div>

          <div className="lg:text-right">
            <p className="text-sm text-zinc-500">Tarjouksen hinta</p>

            <p className="mt-1 text-3xl font-bold text-emerald-400">
              {offer.offer_price !== null
                ? `${offer.offer_price} €`
                : "Ei hintaa"}
            </p>
          </div>
        </div>

        {offer.offer_message && (
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-sm text-zinc-500">Tarjouksen viesti</p>

            <p className="mt-2 whitespace-pre-line leading-7 text-zinc-300">
              {offer.offer_message}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">
            Voimassa asti:{" "}
            <span className="font-medium text-zinc-200">
              {formatDateTime(offer.expires_at)}
            </span>
          </p>

          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-500 hover:bg-zinc-700"
          >
            {expanded
              ? "Piilota partnerin tiedot"
              : "Näytä partnerin tiedot"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-zinc-800 bg-zinc-950/70 p-6">
          <h4 className="text-lg font-bold text-white">
            Partnerin tiedot
          </h4>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <PartnerDetail label="Yritys" value={partner?.company} />
            <PartnerDetail label="Sähköposti" value={partner?.email} />
            <PartnerDetail label="Puhelin" value={partner?.phone} />
            <PartnerDetail label="Toiminta-alue" value={partner?.area} />
            <PartnerDetail label="Kategoria" value={partner?.category} />
            <PartnerDetail
              label="Palvelut"
              value={formatPartnerServices(partner?.services)}
            />
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm text-zinc-500">Kuvat</p>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <img
                    key={`${offer.id}-${index}`}
                    src={image}
                    alt={`${partner?.company || "Partneri"} kuva`}
                    className="h-28 w-40 shrink-0 rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function PartnerDetail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-sm text-zinc-500">{label}</p>

      <p className="mt-1 break-words font-medium text-zinc-200">
        {value || "Ei ilmoitettu"}
      </p>
    </div>
  );
}