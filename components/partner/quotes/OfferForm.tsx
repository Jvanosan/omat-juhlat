"use client";

import { useId } from "react";

import type { OfferDraft } from "./types";

type OfferFormProps = {
  draft: OfferDraft;
  minimumExpiry: string;
  editing: boolean;
  saving: boolean;
  onPriceChange: (
    value: string,
  ) => void;
  onMessageChange: (
    value: string,
  ) => void;
  onExpiryChange: (
    value: string,
  ) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function OfferForm({
  draft,
  minimumExpiry,
  editing,
  saving,
  onPriceChange,
  onMessageChange,
  onExpiryChange,
  onCancel,
  onSubmit,
}: OfferFormProps) {
  const formId = useId();

  const priceId =
    `${formId}-price`;

  const messageId =
    `${formId}-message`;

  const expiryId =
    `${formId}-expiry`;

  const numericPrice =
    Number(draft.price);

  const priceValid =
    draft.price.trim() !== "" &&
    Number.isFinite(numericPrice) &&
    numericPrice > 0;

  const expiryValid =
    Boolean(draft.expiresAt) &&
    draft.expiresAt >=
      minimumExpiry;

  const formValid =
    priceValid && expiryValid;

  return (
    <div className="mt-6 rounded-3xl border border-[#dfcfb6] bg-[#fffaf1] p-5 sm:p-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a773b]">
          {editing
            ? "Tarjouksen päivittäminen"
            : "Uusi tarjous"}
        </p>

        <h4 className="mt-2 text-xl font-bold text-[#211b16]">
          {editing
            ? "Muokkaa lähettämääsi tarjousta"
            : "Anna asiakkaalle tarjous"}
        </h4>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#70675e]">
          Ilmoita kokonaishinta,
          tarjouksen voimassaoloaika ja
          tarvittaessa asiakkaalle tärkeät
          lisätiedot.
        </p>

        {editing && (
          <div className="mt-4 rounded-2xl border border-[#cdddf1] bg-[#f1f6fd] p-4 text-sm leading-6 text-[#3564a8]">
            Muutokset päivittävät aikaisemman
            tarjouksesi. Samalle asiakkaalle
            ei luoda uutta erillistä tarjousta.
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label
            htmlFor={priceId}
            className="mb-2 block text-sm font-bold text-[#3f362f]"
          >
            Kokonaishinta (€){" "}
            <span className="text-[#a33d3d]">
              *
            </span>
          </label>

          <div className="relative">
            <input
              id={priceId}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              required
              disabled={saving}
              value={draft.price}
              onChange={(event) =>
                onPriceChange(
                  event.target.value,
                )
              }
              placeholder="Esim. 1250"
              aria-describedby={`${priceId}-help`}
              className="min-h-14 w-full rounded-2xl border border-[#ded3c4] bg-white px-4 py-3 pr-12 text-[#211b16] outline-none transition placeholder:text-[#aaa096] focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#91877d]"
            >
              €
            </span>
          </div>

          <p
            id={`${priceId}-help`}
            className="mt-2 text-xs leading-5 text-[#70675e]"
          >
            Anna asiakkaan maksama
            kokonaishinta veroineen.
          </p>

          {draft.price &&
            !priceValid && (
              <p className="mt-2 text-xs font-semibold text-[#a33d3d]">
                Hinnan täytyy olla suurempi
                kuin 0 €.
              </p>
            )}
        </div>

        <div>
          <label
            htmlFor={expiryId}
            className="mb-2 block text-sm font-bold text-[#3f362f]"
          >
            Tarjous voimassa asti{" "}
            <span className="text-[#a33d3d]">
              *
            </span>
          </label>

          <input
            id={expiryId}
            type="date"
            min={minimumExpiry}
            required
            disabled={saving}
            value={draft.expiresAt}
            onChange={(event) =>
              onExpiryChange(
                event.target.value,
              )
            }
            aria-describedby={`${expiryId}-help`}
            className="min-h-14 w-full rounded-2xl border border-[#ded3c4] bg-white px-4 py-3 text-[#211b16] outline-none transition focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p
            id={`${expiryId}-help`}
            className="mt-2 text-xs leading-5 text-[#70675e]"
          >
            Asiakas voi valita tarjouksen
            tähän päivään asti.
          </p>

          {draft.expiresAt &&
            !expiryValid && (
              <p className="mt-2 text-xs font-semibold text-[#a33d3d]">
                Valitse aikaisintaan{" "}
                {formatInputDate(
                  minimumExpiry,
                )}
                .
              </p>
            )}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor={messageId}
            className="text-sm font-bold text-[#3f362f]"
          >
            Viesti asiakkaalle
          </label>

          <span className="text-xs text-[#91877d]">
            Valinnainen
          </span>
        </div>

        <textarea
          id={messageId}
          rows={5}
          maxLength={2000}
          disabled={saving}
          value={draft.message}
          onChange={(event) =>
            onMessageChange(
              event.target.value,
            )
          }
          placeholder="Kerro esimerkiksi, mitä hinta sisältää ja mitä asiakkaan on hyvä tietää."
          className="w-full resize-y rounded-2xl border border-[#ded3c4] bg-white px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#aaa096] focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <p className="mt-2 text-right text-xs text-[#91877d]">
          {draft.message.length} / 2000
          merkkiä
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#eadfce] pt-5 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8c7ad] bg-white px-5 py-3 text-sm font-bold text-[#62584f] transition hover:border-[#b48a45] hover:text-[#211b16] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Peruuta
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={
            saving || !formValid
          }
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#168365] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {saving
            ? editing
              ? "Tallennetaan..."
              : "Lähetetään..."
            : editing
              ? "Tallenna muutokset"
              : "Lähetä tarjous"}
        </button>
      </div>

      {!formValid && (
        <p
          aria-live="polite"
          className="mt-3 text-center text-xs text-[#91877d] sm:text-right"
        >
          Täytä hinta ja voimassaoloaika
          lähettääksesi tarjouksen.
        </p>
      )}
    </div>
  );
}

function formatInputDate(
  value: string,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(
    `${value}T00:00:00`,
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "fi-FI",
  ).format(date);
}