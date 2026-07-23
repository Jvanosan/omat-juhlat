type RequestFormProps = {
  success: boolean;
  eventType: string;
  location: string;
  email: string;
  guests: string;
  notes: string;
  sending: boolean;
  eventTypes: string[];
  locations: string[];
  selectedPartnersCount: number;
  onEventTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onGuestsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
};

const fieldClassName =
  "min-h-14 w-full rounded-2xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3.5 text-[#211b16] outline-none transition placeholder:text-[#91877d] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35";

export default function RequestForm({
  success,
  eventType,
  location,
  email,
  guests,
  notes,
  sending,
  eventTypes,
  locations,
  selectedPartnersCount,
  onEventTypeChange,
  onLocationChange,
  onEmailChange,
  onGuestsChange,
  onNotesChange,
  onSubmit,
}: RequestFormProps) {
  return (
    <section
  id="direct-request-form" className="mx-auto mt-16 max-w-3xl rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-[0_18px_50px_rgba(73,53,31,0.08)] sm:p-8">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a773b]">
          Tarjouspyyntö
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#211b16] sm:text-3xl">
          Lähetä tarjouspyyntö
        </h2>

        <p className="mt-2 leading-7 text-[#70675e]">
          Pyyntö lähetetään vain valitsemillesi
          palveluntarjoajille.
        </p>

        <div className="mt-5 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm"
            >
              🔒
            </div>

            <div>
              <h3 className="font-bold text-[#11634d]">
                Turvallinen tarjouspyyntö
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#41685d]">
                Yhteystietosi lähetetään vain valitsemillesi
                palveluntarjoajille, eikä niitä jaeta muille
                yrityksille.
              </p>
            </div>
          </div>
        </div>
      </div>

      {success ? (
        <div
          role="status"
          className="rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-6 text-center"
        >
          <div className="text-3xl" aria-hidden="true">
            ✅
          </div>

          <h3 className="mt-3 text-lg font-bold text-[#11634d]">
            Tarjouspyyntö lähetettiin
          </h3>

          <p className="mt-1 text-sm leading-6 text-[#41685d]">
            Saat turvallisen linkin tarjousten seuraamiseen
            sähköpostiisi.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="request-event-type"
                className="mb-2 block text-sm font-bold text-[#51463d]"
              >
                Tapahtuman tyyppi
              </label>

              <select
                id="request-event-type"
                value={eventType}
                onChange={(event) =>
                  onEventTypeChange(event.target.value)
                }
                required
                className={fieldClassName}
              >
                <option value="">
                  Valitse tapahtuman tyyppi *
                </option>

                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="request-location"
                className="mb-2 block text-sm font-bold text-[#51463d]"
              >
                Tapahtuman sijainti
              </label>

              <select
                id="request-location"
                value={location}
                onChange={(event) =>
                  onLocationChange(event.target.value)
                }
                required
                className={fieldClassName}
              >
                <option value="">
                  Valitse sijainti *
                </option>

                {locations.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="request-email"
              className="mb-2 block text-sm font-bold text-[#51463d]"
            >
              Sähköpostiosoite
            </label>

            <input
              id="request-email"
              type="email"
              required
              autoComplete="email"
              placeholder="esimerkiksi nimi@email.fi"
              value={email}
              onChange={(event) =>
                onEmailChange(event.target.value)
              }
              className={fieldClassName}
            />

            <p className="mt-2 text-xs leading-5 text-[#91877d]">
              Lähetämme tähän osoitteeseen turvallisen linkin,
              jonka kautta voit seurata tarjouksia.
            </p>
          </div>

          <div>
            <label
              htmlFor="request-guests"
              className="mb-2 block text-sm font-bold text-[#51463d]"
            >
              Arvioitu vierasmäärä
            </label>

            <input
              id="request-guests"
              type="number"
              required
              min={1}
              max={10000}
              inputMode="numeric"
              placeholder="Esimerkiksi 80"
              value={guests}
              onChange={(event) =>
                onGuestsChange(event.target.value)
              }
              className={fieldClassName}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="request-notes"
                className="block text-sm font-bold text-[#51463d]"
              >
                Lisätiedot
              </label>

              <span className="text-xs font-medium text-[#91877d]">
                Valinnainen
              </span>
            </div>

            <textarea
              id="request-notes"
              placeholder="Kerro esimerkiksi juhlan tyylistä, aikataulusta tai erityistoiveista."
              maxLength={2000}
              rows={6}
              value={notes}
              onChange={(event) =>
                onNotesChange(event.target.value)
              }
              className={`${fieldClassName} min-h-36 resize-y`}
            />

            <p className="mt-2 text-right text-xs font-medium text-[#91877d]">
              {2000 - notes.length} merkkiä jäljellä
            </p>
          </div>

          {selectedPartnersCount > 0 ? (
            <div className="rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] px-4 py-3 text-center text-sm font-semibold text-[#11634d]">
              ✓ Tarjouspyyntö lähetetään{" "}
              {selectedPartnersCount} valitulle
              palveluntarjoajalle.
            </div>
          ) : (
            <div className="rounded-2xl border border-[#ead29d] bg-[#fff8e8] px-4 py-3 text-center text-sm font-semibold text-[#795a28]">
              Valitse ensin vähintään yksi palveluntarjoaja.
            </div>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={
              sending || selectedPartnersCount === 0
            }
            className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 text-base font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f783a] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? "Lähetetään..."
              : "Lähetä tarjouspyyntö"}
          </button>

          <p className="text-center text-xs leading-5 text-[#91877d]">
            Tarjouspyyntö ei sido sinua varaamaan palvelua.
          </p>
        </div>
      )}
    </section>
  );
}