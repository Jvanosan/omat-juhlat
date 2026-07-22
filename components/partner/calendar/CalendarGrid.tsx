import type {
  CalendarDay,
} from "./types";

const WEEKDAYS = [
  "Ma",
  "Ti",
  "Ke",
  "To",
  "Pe",
  "La",
  "Su",
];

type CalendarGridProps = {
  days: CalendarDay[];
  onSelectDay: (
    day: CalendarDay,
  ) => void;
};

export default function CalendarGrid({
  days,
  onSelectDay,
}: CalendarGridProps) {
  return (
    <>
      {/* Puhelin ja pieni tabletti */}
      <div className="md:hidden">
        <WeekdayHeader compact />

        <div className="grid grid-cols-7 gap-px bg-[#e9dfd2]">
          {days.map((day) => (
            <MobileCalendarDay
              key={day.date}
              day={day}
              onSelectDay={onSelectDay}
            />
          ))}
        </div>

        <div className="border-t border-[#e8ded0] bg-[#fffaf2] px-4 py-3">
          <p className="text-center text-xs leading-5 text-[#70675e]">
            Napauta päivää nähdäksesi
            tarkemmat tiedot tai lisätäksesi
            merkinnän.
          </p>
        </div>
      </div>

      {/* Suuri tabletti ja tietokone */}
      <div className="hidden md:block">
        <WeekdayHeader />

        <div className="grid grid-cols-7 bg-[#e9dfd2]">
          {days.map((day) => (
            <DesktopCalendarDay
              key={day.date}
              day={day}
              onSelectDay={onSelectDay}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function WeekdayHeader({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-7 border-b border-[#e8ded0] bg-[#f7f1e8]">
      {WEEKDAYS.map(
        (weekday, index) => (
          <div
            key={weekday}
            className={`text-center text-xs font-bold uppercase tracking-wide ${
              compact
                ? "px-1 py-2.5"
                : "px-3 py-3.5"
            } ${
              index >= 5
                ? "text-[#a47c3c]"
                : "text-[#70675e]"
            }`}
          >
            {weekday}
          </div>
        ),
      )}
    </div>
  );
}

function MobileCalendarDay({
  day,
  onSelectDay,
}: {
  day: CalendarDay;
  onSelectDay: (
    day: CalendarDay,
  ) => void;
}) {
  const disabled =
    day.isPast ||
    !day.isCurrentMonth;

  const hasConfirmedBooking =
    Boolean(
      day.entry?.bookings?.length,
    );

  const statusClasses =
    day.entry?.status === "booked"
      ? hasConfirmedBooking
        ? "bg-[#e4f5ed]"
        : "bg-[#edf8f3]"
      : day.entry?.status ===
          "unavailable"
        ? "bg-[#fff0f0]"
        : "bg-white";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        onSelectDay(day)
      }
      aria-label={getDayLabel(day)}
      className={`relative flex min-h-16 flex-col items-center justify-start px-0.5 py-2 text-center transition ${statusClasses} ${
        disabled
          ? "cursor-default opacity-35"
          : "active:bg-[#f5ead8]"
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
          day.isToday
            ? "bg-[#b48a45] text-white shadow-sm"
            : day.entry?.status ===
                "booked"
              ? "text-[#11634d]"
              : day.entry?.status ===
                  "unavailable"
                ? "text-[#a33d3d]"
                : "text-[#3f362f]"
        }`}
      >
        {day.dayNumber}
      </span>

      {day.entry && (
        <span
          aria-hidden="true"
          className={`mt-1.5 h-2 w-2 rounded-full ${
            day.entry.status ===
            "booked"
              ? hasConfirmedBooking
                ? "bg-[#b48a45]"
                : "bg-[#168365]"
              : "bg-[#c55454]"
          }`}
        />
      )}

      {hasConfirmedBooking && (
        <span className="mt-1 hidden text-[9px] font-bold text-[#87652f] min-[430px]:block">
          Asiakas
        </span>
      )}
    </button>
  );
}

function DesktopCalendarDay({
  day,
  onSelectDay,
}: {
  day: CalendarDay;
  onSelectDay: (
    day: CalendarDay,
  ) => void;
}) {
  const disabled =
    day.isPast ||
    !day.isCurrentMonth;

  const hasConfirmedBooking =
    Boolean(
      day.entry?.bookings?.length,
    );

  const statusClasses =
    day.entry?.status === "booked"
      ? hasConfirmedBooking
        ? "bg-[#f5fbf8]"
        : "bg-[#f3faf7]"
      : day.entry?.status ===
          "unavailable"
        ? "bg-[#fff6f6]"
        : "bg-white";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        onSelectDay(day)
      }
      aria-label={getDayLabel(day)}
      className={`group relative min-h-32 border-b border-r border-[#e8ded0] p-3 text-left transition ${statusClasses} ${
        disabled
          ? "cursor-default opacity-35"
          : "hover:z-10 hover:border-[#c8a96a] hover:bg-[#fffaf2] hover:shadow-[0_8px_24px_rgba(73,53,31,0.12)] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b48a45]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            day.isToday
              ? "bg-[#b48a45] text-white shadow-sm"
              : "text-[#3f362f]"
          }`}
        >
          {day.dayNumber}
        </span>

        {day.entry && (
          <span
            className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
              day.entry.status ===
              "booked"
                ? hasConfirmedBooking
                  ? "border-[#e2c98f] bg-[#fff8e8] text-[#87652f]"
                  : "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]"
                : "border-[#edcaca] bg-[#fff0f0] text-[#a33d3d]"
            }`}
          >
            {day.entry.status ===
            "booked"
              ? hasConfirmedBooking
                ? "Vahvistettu"
                : "Varattu"
              : "Ei vapaa"}
          </span>
        )}
      </div>

      {hasConfirmedBooking && (
        <div className="mt-3">
          <p className="line-clamp-1 text-xs font-bold text-[#87652f]">
            🎉 Asiakasvaraus
          </p>

          <p className="mt-1 text-[11px] text-[#91877d]">
            {day.entry?.bookings
              ?.length === 1
              ? "Avaa asiakkaan tiedot"
              : `${day.entry?.bookings?.length} vahvistettua varausta`}
          </p>
        </div>
      )}

      {!hasConfirmedBooking &&
        day.entry?.note && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#70675e]">
            {day.entry.note}
          </p>
        )}

      {!disabled && !day.entry && (
        <p className="mt-4 text-xs font-medium text-[#a69b90] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          + Lisää merkintä
        </p>
      )}
    </button>
  );
}

function getDayLabel(
  day: CalendarDay,
) {
  const parts = [
    day.date,
  ];

  if (day.isToday) {
    parts.push("Tänään");
  }

  if (
    day.entry?.bookings?.length
  ) {
    parts.push(
      `${day.entry.bookings.length} vahvistettua asiakasvarausta`,
    );
  } else if (
    day.entry?.status === "booked"
  ) {
    parts.push("Varattu");
  } else if (
    day.entry?.status ===
    "unavailable"
  ) {
    parts.push("Ei saatavilla");
  } else {
    parts.push("Vapaa");
  }

  return parts.join(", ");
}