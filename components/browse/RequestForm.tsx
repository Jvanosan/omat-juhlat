type RequestFormProps = {
  success: boolean;
  eventType: string;
  email: string;
  eventDate: string;
  guests: string;
  notes: string;
  sending: boolean;
  minDate: string;
  eventTypes: string[];
  selectedPartnersCount: number;
  onEventTypeChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onEventDateChange: (value: string) => void;
  onGuestsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
};

export default function RequestForm({
  success,
  eventType,
  email,
  eventDate,
  guests,
  notes,
  sending,
  minDate,
  eventTypes,
  selectedPartnersCount,
  onEventTypeChange,
  onEmailChange,
  onEventDateChange,
  onGuestsChange,
  onNotesChange,
  onSubmit,
}: RequestFormProps) {
  return (
    <div className="mt-16 max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Lähetä tarjouspyyntö
        </h2>

        <p className="mt-1 text-zinc-400">
          Pyyntö lähetetään vain valitsemillesi palveluntarjoajille.
        </p>

        <div className="mt-4 rounded-2xl border border-emerald-900 bg-emerald-950/30 p-4">
          <div className="font-medium text-emerald-400">
            🔒 Turvallinen tarjouspyyntö
          </div>

          <p className="mt-1 text-sm text-zinc-300">
            Tarjouspyyntö lähetetään vain valitsemillesi
            palveluntarjoajille. Tietojasi ei lähetetä muille yrityksille.
          </p>
        </div>
      </div>

      {success ? (
        <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 p-6 text-emerald-400">
          ✅ Tarjouspyyntö lähetetty onnistuneesti!
        </div>
      ) : (
        <div className="space-y-4">
          

          <select
            value={eventType}
            onChange={(e) => onEventTypeChange(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white focus:border-emerald-700 focus:outline-none"
          >
            <option value="">Valitse tapahtuman tyyppi</option>

            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="email"
            placeholder="Sähköpostiosoitteesi"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 focus:border-emerald-700 focus:outline-none"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="date"
              min={minDate}
              value={eventDate}
              onChange={(e) => onEventDateChange(e.target.value)}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white focus:border-emerald-700 focus:outline-none"
            />

            <input
              type="number"
              min={1}
              max={5000}
              placeholder="Arvioitu vierasmäärä"
              value={guests}
              onChange={(e) => onGuestsChange(e.target.value)}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 focus:border-emerald-700 focus:outline-none"
            />
          </div>

          <textarea
            placeholder="Lisätiedot (valinnainen)"
            maxLength={1000}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 focus:border-emerald-700 focus:outline-none"
          />

          <p className="text-right text-xs text-zinc-500">
            {1000 - notes.length} merkkiä jäljellä
          </p>

          <button
            onClick={onSubmit}
            disabled={sending}
            className="mt-2 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-semibold transition hover:bg-emerald-700 active:scale-[0.985] disabled:opacity-70"
          >
            {sending ? "Lähetetään..." : "Lähetä tarjouspyyntö"}
          </button>

          {selectedPartnersCount > 0 && (
            <p className="text-center text-sm text-emerald-400">
              Tarjouspyyntö lähetetään {selectedPartnersCount} valitulle
              palveluntarjoajalle.
            </p>
          )}
        </div>
      )}
    </div>
  );
}