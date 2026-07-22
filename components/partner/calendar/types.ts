export type CalendarEntryStatus =
  | "unavailable"
  | "booked";

export type CalendarBookingSource =
  | "direct"
  | "category";

export type CalendarBookingDetails = {
  source: CalendarBookingSource;
  requestId: string;

  customerName: string | null;
  customerEmail: string;
  customerPhone: string | null;

  eventType: string | null;
  location: string | null;
  guests: number | null;

  service: string | null;
  price: number | null;
};

export type CalendarEntry = {
  id: string;
  partner_id: string;
  date: string;
  status: CalendarEntryStatus;
  note: string | null;
  created_at: string;
  updated_at: string;

  // Tätä ei tallenneta
  // partner_calendar_entries-tauluun.
  // Tiedot yhdistetään vain vahvistetusta
  // varauksesta kalenteria ladattaessa.
  booking?: CalendarBookingDetails | null;
};

export type CalendarDay = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  entry: CalendarEntry | null;
};