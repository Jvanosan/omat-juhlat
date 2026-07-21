"use client";

import type { OfferDraft } from "./types";

type OfferFormProps = {
  draft: OfferDraft;
  minimumExpiry: string;
  editing: boolean;
  saving: boolean;
  onPriceChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
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
  return (
    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <h4 className="mb-2 text-lg font-semibold">
        {editing
          ? "Muokkaa lähettämääsi tarjousta"
          : "Lähetä tarjous"}
      </h4>

      {editing && (
        <p className="mb-5 text-sm text-blue-300">
          Tallentaminen päivittää aikaisemman tarjouksesi.
          Uutta tarjousta ei luoda.
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="partner-offer-price"
            className="mb-2 block text-sm text-zinc-400"
          >
            Hinta (€) *
          </label>

          <input
            id="partner-offer-price"
            type="number"
            min="0.01"
            step="0.01"
            required
            disabled={saving}
            value={draft.price}
            onChange={(event) =>
              onPriceChange(event.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="partner-offer-message"
            className="mb-2 block text-sm text-zinc-400"
          >
            Viesti asiakkaalle
          </label>

          <textarea
            id="partner-offer-message"
            rows={5}
            maxLength={2000}
            disabled={saving}
            value={draft.message}
            onChange={(event) =>
              onMessageChange(event.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-1 text-right text-xs text-zinc-500">
            {draft.message.length} / 2000 merkkiä
          </p>
        </div>

        <div>
          <label
            htmlFor="partner-offer-expiry"
            className="mb-2 block text-sm text-zinc-400"
          >
            Tarjous voimassa asti *
          </label>

          <input
            id="partner-offer-expiry"
            type="date"
            min={minimumExpiry}
            required
            disabled={saving}
            value={draft.expiresAt}
            onChange={(event) =>
              onExpiryChange(event.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border border-zinc-700 px-4 py-2 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Peruuta
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>
    </div>
  );
}