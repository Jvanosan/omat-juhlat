"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  formatCalendarDate,
} from "./calendarUtils";

import type {
  CalendarBookingDetails,
  CalendarDay,
  CalendarEntryStatus,
} from "./types";

type CalendarEntryModalProps = {
  day: CalendarDay;
  processing: boolean;

  onClose: () => void;

  onSave: (
    status: CalendarEntryStatus,
    note: string,
  ) => Promise<boolean>;

  onDelete: () => Promise<boolean>;
};

export default function CalendarEntryModal({
  day,
  processing,
  onClose,
  onSave,
  onDelete,
}: CalendarEntryModalProps) {
  const [status, setStatus] =
    useState<CalendarEntryStatus>(
      day.entry?.status ??
        "unavailable",
    );

  const [note, setNote] = useState(
    day.entry?.note ?? "",
  );

  const bookings =
    day.entry?.bookings ?? [];

  const hasConfirmedBooking =
    bookings.length > 0;

  useEffect(() => {
    setStatus(
      day.entry?.status ??
        "unavailable",
    );

    setNote(day.entry?.note ?? "");
  }, [day]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !processing
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onClose, processing]);

  async function handleSave() {
    if (hasConfirmedBooking) {
      return;
    }

    const success = await onSave(
      status,
      note,
    );

    if (success) {
      onClose();
    }
  }

  async function handleDelete() {
    if (hasConfirmedBooking) {
      return;
    }

    const success = await onDelete();

    if (success) {
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#211b16]/65 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !processing
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e2d5c4] bg-[#fffdf9] shadow-[0_28px_80px_rgba(42,31,20,0.3)]">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-[#eee5d9] bg-[#fffdf9]/95 px-5 py-5 backdrop-blur sm:px-7 sm:py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
              {hasConfirmedBooking
                ? "Vahvistettu varaus"
                : "Kalenterimerkintä"}
            </p>

            <h2
              id="calendar-modal-title"
              className="mt-2 text-xl font-bold text-[#211b16] sm:text-2xl"
            >
              {formatCalendarDate(
                day.date,
              )}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            aria-label="Sulje ikkuna"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ded3c4] bg-white text-lg text-[#62584f] transition hover:border-[#c8a96a] hover:bg-[#fbf6ed] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </header>

        <div className="space-y-6 px-5 py-6 sm:px-7">
          {hasConfirmedBooking ? (
            <>
              <div className="flex items-start gap-3 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-4 text-[#11634d]">
                <span
                  aria-hidden="true"
                  className="text-xl"
                >
                  ✓
                </span>

                <div>
                  <p className="font-bold">
                    Päivälle on vahvistettu
                    asiakasvaraus
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#41685d]">
                    Varaus lisättiin
                    automaattisesti asiakkaan
                    hyväksyttyä tarjouksesi.
                    Vahvistettua varausta ei voi
                    muuttaa tai poistaa
                    kalenterista käsin.
                  </p>
                </div>
              </div>

              <section>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#91877d]">
                    Varaustiedot
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#211b16]">
                    {bookings.length === 1
                      ? "Asiakkaan varaus"
                      : `${bookings.length} vahvistettua varausta`}
                  </h3>
                </div>

                <div className="space-y-4">
                  {bookings.map(
                    (booking, index) => (
                      <BookingCard
                        key={`${booking.source}-${booking.requestId}-${index}`}
                        booking={booking}
                      />
                    ),
                  )}
                </div>
              </section>

              {note && (
                <section className="rounded-2xl border border-[#e8ded0] bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
                    Oma muistiinpano
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#62584f]">
                    {note}
                  </p>
                </section>
              )}
            </>
          ) : (
            <>
              <fieldset>
                <legend className="mb-3 text-sm font-bold text-[#3f362f]">
                  Päivän tila
                </legend>

                <div className="grid gap-3 sm:grid-cols-2">
                  <StatusOption
                    label="Ei saatavilla"
                    description="Et ota vastaan uusia varauksia tälle päivälle."
                    value="unavailable"
                    selected={status}
                    onSelect={setStatus}
                    color="red"
                  />

                  <StatusOption
                    label="Varattu"
                    description="Päivällä on muu sovittu varaus tai tapahtuma."
                    value="booked"
                    selected={status}
                    onSelect={setStatus}
                    color="green"
                  />
                </div>
              </fieldset>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#3f362f]">
                  Oma muistiinpano
                </span>

                <textarea
                  value={note}
                  maxLength={500}
                  rows={4}
                  disabled={processing}
                  placeholder="Esimerkiksi varauksen nimi tai muu oma muistio..."
                  onChange={(event) =>
                    setNote(
                      event.target.value,
                    )
                  }
                  className="w-full resize-y rounded-2xl border border-[#ded3c4] bg-white px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#a69b90] focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <span className="mt-1 block text-right text-xs text-[#91877d]">
                  {note.length}/500 merkkiä
                </span>
              </label>

              <div className="rounded-2xl border border-[#d7e1ef] bg-[#f3f7fc] p-4 text-sm leading-6 text-[#4c627e]">
                Kalenterin omat muistiinpanot
                näkyvät vain yrityksellesi,
                eivät asiakkaalle.
              </div>
            </>
          )}
        </div>

        <footer className="sticky bottom-0 border-t border-[#eee5d9] bg-[#fffdf9]/95 px-5 py-4 backdrop-blur sm:px-7">
          {hasConfirmedBooking ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 rounded-xl bg-[#b48a45] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#9f783a]"
              >
                Sulje
              </button>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {day.entry && (
                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete()
                    }
                    disabled={processing}
                    className="w-full rounded-xl border border-[#e8b9b9] bg-[#fff4f4] px-4 py-3 text-sm font-bold text-[#a33d3d] transition hover:bg-[#ffeaea] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    Poista merkintä
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={processing}
                  className="flex-1 rounded-xl border border-[#ded3c4] bg-white px-4 py-3 text-sm font-bold text-[#62584f] transition hover:bg-[#fbf6ed] disabled:opacity-50 sm:flex-none"
                >
                  Peruuta
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleSave()
                  }
                  disabled={processing}
                  className="flex-1 rounded-xl bg-[#168365] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  {processing
                    ? "Tallennetaan..."
                    : "Tallenna merkintä"}
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
}: {
  booking: CalendarBookingDetails;
}) {
  const sourceLabel =
    booking.source === "direct"
      ? "Suora tarjouspyyntö"
      : "Kategoriapohjainen tarjouspyyntö";

  return (
    <article className="rounded-2xl border border-[#e8ded0] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full border border-[#b9dfd0] bg-[#edf8f3] px-3 py-1 text-xs font-bold text-[#11634d]">
            Vahvistettu
          </span>

          <h4 className="mt-3 text-lg font-bold text-[#211b16]">
            {booking.eventType ||
              "Asiakkaan tapahtuma"}
          </h4>
        </div>

        <span className="rounded-full border border-[#e3d3b8] bg-[#fbf5e9] px-3 py-1 text-xs font-semibold text-[#87652f]">
          {sourceLabel}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <BookingDetail
          icon="👤"
          label="Asiakas"
          value={
            booking.customerName ||
            "Nimeä ei ilmoitettu"
          }
        />

        <BookingDetail
          icon="📍"
          label="Sijainti"
          value={
            booking.location ||
            "Ei ilmoitettu"
          }
        />

        <BookingDetail
          icon="👥"
          label="Vierasmäärä"
          value={
            booking.guests
              ? `${booking.guests} henkilöä`
              : "Ei ilmoitettu"
          }
        />

        <BookingDetail
          icon="🎉"
          label="Palvelu"
          value={
            booking.service ||
            "Ei ilmoitettu"
          }
        />

        <BookingDetail
          icon="💶"
          label="Hyväksytty hinta"
          value={formatPrice(
            booking.price,
          )}
        />
      </dl>

      {(booking.customerEmail ||
        booking.customerPhone) && (
        <section className="mt-5 border-t border-[#eee5d9] pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#91877d]">
            Asiakkaan yhteystiedot
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {booking.customerEmail && (
              <a
                href={`mailto:${booking.customerEmail}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#b48a45] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#9f783a]"
              >
                <span aria-hidden="true">
                  ✉️
                </span>

                Lähetä sähköpostia
              </a>
            )}

            {booking.customerPhone && (
              <a
                href={`tel:${normalizePhone(
                  booking.customerPhone,
                )}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#b9dfd0] bg-[#edf8f3] px-4 py-3 text-sm font-bold text-[#11634d] transition hover:bg-[#dff2ea]"
              >
                <span aria-hidden="true">
                  📞
                </span>

                {booking.customerPhone}
              </a>
            )}
          </div>

          {booking.customerEmail && (
            <p className="mt-3 break-all text-sm text-[#70675e]">
              {booking.customerEmail}
            </p>
          )}
        </section>
      )}
    </article>
  );
}

function BookingDetail({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#eee5d9] bg-[#fffdf9] p-4">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#91877d]">
        <span aria-hidden="true">
          {icon}
        </span>

        {label}
      </dt>

      <dd className="mt-2 break-words font-semibold text-[#3f362f]">
        {value}
      </dd>
    </div>
  );
}

function StatusOption({
  label,
  description,
  value,
  selected,
  onSelect,
  color,
}: {
  label: string;
  description: string;
  value: CalendarEntryStatus;
  selected: CalendarEntryStatus;
  onSelect: (
    value: CalendarEntryStatus,
  ) => void;
  color: "red" | "green";
}) {
  const active = selected === value;

  const activeClasses =
    color === "red"
      ? "border-[#dc8989] bg-[#fff1f1] shadow-sm"
      : "border-[#73bda7] bg-[#edf8f3] shadow-sm";

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? activeClasses
          : "border-[#ded3c4] bg-white hover:border-[#c8a96a] hover:bg-[#fffaf1]"
      }`}
    >
      <span className="flex items-center gap-2 font-bold text-[#211b16]">
        <span
          className={`h-3 w-3 rounded-full ${
            color === "red"
              ? "bg-[#c55454]"
              : "bg-[#168365]"
          }`}
        />

        {label}
      </span>

      <span className="mt-2 block text-xs leading-5 text-[#70675e]">
        {description}
      </span>
    </button>
  );
}

function formatPrice(
  value: number | null,
) {
  if (
    value === null ||
    !Number.isFinite(Number(value))
  ) {
    return "Ei ilmoitettu";
  }

  return `${new Intl.NumberFormat(
    "fi-FI",
    {
      minimumFractionDigits:
        Number.isInteger(Number(value))
          ? 0
          : 2,
      maximumFractionDigits: 2,
    },
  ).format(Number(value))} €`;
}

function normalizePhone(
  value: string,
) {
  return value.replace(
    /[^\d+]/g,
    "",
  );
}