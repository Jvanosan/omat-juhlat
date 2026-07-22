import type {
  CalendarDay,
  CalendarEntry,
} from "./types";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateKey(date: Date) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-");
}

export function getMonthLabel(
  year: number,
  month: number,
) {
  const date = new Date(year, month, 1);

  const label = new Intl.DateTimeFormat("fi-FI", {
    month: "long",
    year: "numeric",
  }).format(date);

  return (
    label.charAt(0).toUpperCase() +
    label.slice(1)
  );
}

export function moveMonth(
  year: number,
  month: number,
  amount: number,
) {
  const date = new Date(
    year,
    month + amount,
    1,
  );

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

export function createCalendarDays(
  year: number,
  month: number,
  entries: CalendarEntry[],
): CalendarDay[] {
  const firstDay = new Date(year, month, 1);

  // JavaScript: sunnuntai 0.
  // Kalenterimme alkaa maanantaista.
  const mondayIndex =
    (firstDay.getDay() + 6) % 7;

  const gridStart = new Date(
    year,
    month,
    1 - mondayIndex,
  );

  const todayKey = toDateKey(new Date());

  const entriesByDate = new Map(
    entries.map((entry) => [
      entry.date,
      entry,
    ]),
  );

  return Array.from(
    { length: 42 },
    (_, index) => {
      const date = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index,
      );

      const dateKey = toDateKey(date);

      return {
        date: dateKey,
        dayNumber: date.getDate(),
        isCurrentMonth:
          date.getMonth() === month,
        isToday: dateKey === todayKey,
        isPast: dateKey < todayKey,
        entry:
          entriesByDate.get(dateKey) ?? null,
      };
    },
  );
}

export function formatCalendarDate(
  value: string,
) {
  const [year, month, day] = value
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  return new Intl.DateTimeFormat("fi-FI", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}