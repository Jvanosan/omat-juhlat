import type {
  CustomerQuote,
} from "./types";

import {
  formatEventDate,
} from "./quoteUtils";

export default function QuoteEventDetails({
  quote,
}: {
  quote: CustomerQuote;
}) {
  return (
    <section className="rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
          Tarjouspyyntösi
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
          Juhlan tiedot
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <EventDetail
          icon="📅"
          label="Päivämäärä"
          value={formatEventDate(
            quote.date,
          )}
        />

        <EventDetail
          icon="📍"
          label="Sijainti"
          value={
            quote.location ||
            "Ei ilmoitettu"
          }
        />

        <EventDetail
          icon="👥"
          label="Vierasmäärä"
          value={
            quote.guests
              ? `${quote.guests} henkilöä`
              : "Ei ilmoitettu"
          }
        />
      </div>
    </section>
  );
}

function EventDetail({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eee5d9] bg-[#fffdf9] p-4">
      <div
        aria-hidden="true"
        className="text-2xl"
      >
        {icon}
      </div>

      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#91877d]">
        {label}
      </p>

      <p className="mt-1 break-words font-bold text-[#3f362f]">
        {value}
      </p>
    </div>
  );
}