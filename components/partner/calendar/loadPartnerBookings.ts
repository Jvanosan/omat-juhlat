import type {
  CalendarBookingDetails,
} from "./types";

type CalendarBookingApiItem =
  CalendarBookingDetails & {
    date: string;
  };

type CalendarBookingsApiResponse = {
  bookings?: CalendarBookingApiItem[];
  error?: string;
};

export async function loadPartnerBookings({
  accessToken,
  rangeStart,
  rangeEnd,
}: {
  accessToken: string;
  rangeStart: string;
  rangeEnd: string;
}): Promise<
  Map<string, CalendarBookingDetails[]>
> {
  const query =
    new URLSearchParams({
      rangeStart,
      rangeEnd,
    });

  const response = await fetch(
    `/api/partner/calendar-bookings?${query.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
      },
    },
  );

  const result =
    (await response
      .json()
      .catch(
        () => ({}),
      )) as CalendarBookingsApiResponse;

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Kalenterin varaustietojen hakeminen epäonnistui.",
    );
  }

  const bookingsByDate = new Map<
    string,
    CalendarBookingDetails[]
  >();

  for (
    const booking of
    result.bookings ?? []
  ) {
    if (!booking.date) {
      continue;
    }

    const {
      date,
      ...bookingDetails
    } = booking;

    const currentBookings =
      bookingsByDate.get(date) ?? [];

    bookingsByDate.set(date, [
      ...currentBookings,
      bookingDetails,
    ]);
  }

  return bookingsByDate;
}