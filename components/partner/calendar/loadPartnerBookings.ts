import { supabase } from "@/lib/supabase";

import type {
  CalendarBookingDetails,
} from "./types";

export async function loadPartnerBookings({
  partnerId,
  rangeStart,
  rangeEnd,
}: {
  partnerId: string;
  rangeStart: string;
  rangeEnd: string;
}): Promise<
  Map<string, CalendarBookingDetails[]>
> {
  const bookingsByDate = new Map<
    string,
    CalendarBookingDetails[]
  >();

  await Promise.all([
    loadDirectBookings({
      partnerId,
      rangeStart,
      rangeEnd,
      bookingsByDate,
    }),

    loadCategoryBookings({
      partnerId,
      rangeStart,
      rangeEnd,
      bookingsByDate,
    }),
  ]);

  return bookingsByDate;
}

async function loadDirectBookings({
  partnerId,
  rangeStart,
  rangeEnd,
  bookingsByDate,
}: BookingLoaderArguments) {
  const {
    data: offerRows,
    error: offersError,
  } = await supabase
    .from("direct_request_offers")
    .select(`
      direct_request_id,
      price,
      status
    `)
    .eq("partner_id", partnerId)
    .eq("status", "accepted");

  if (offersError) {
    throw offersError;
  }

  const offers = offerRows ?? [];

  if (offers.length === 0) {
    return;
  }

  const requestIds = Array.from(
    new Set(
      offers.map((offer) =>
        String(
          offer.direct_request_id,
        ),
      ),
    ),
  );

  const {
    data: requestRows,
    error: requestsError,
  } = await supabase
    .from("direct_requests")
    .select(`
      id,
      email,
      event_date,
      guests,
      customer_name,
      phone,
      location,
      services,
      event_type
    `)
    .in("id", requestIds)
    .gte("event_date", rangeStart)
    .lte("event_date", rangeEnd);

  if (requestsError) {
    throw requestsError;
  }

  const requestsById = new Map(
    (requestRows ?? []).map(
      (request) => [
        String(request.id),
        request,
      ],
    ),
  );

  offers.forEach((offer) => {
    const request =
      requestsById.get(
        String(
          offer.direct_request_id,
        ),
      );

    if (!request?.event_date) {
      return;
    }

    addBooking(
      bookingsByDate,
      request.event_date,
      {
        source: "direct",
        requestId: String(
          request.id,
        ),

        customerName:
          request.customer_name ??
          null,

        customerEmail:
          request.email ?? null,

        customerPhone:
          request.phone ?? null,

        eventType:
          request.event_type ??
          null,

        location:
          request.location ?? null,

        guests:
          request.guests === null ||
          request.guests === undefined
            ? null
            : Number(
                request.guests,
              ),

        service:
          request.services ??
          null,

        price:
          offer.price === null ||
          offer.price === undefined
            ? null
            : Number(offer.price),
      },
    );
  });
}

async function loadCategoryBookings({
  partnerId,
  rangeStart,
  rangeEnd,
  bookingsByDate,
}: BookingLoaderArguments) {
  const {
    data: offerRows,
    error: offersError,
  } = await supabase
    .from("quote_partners")
    .select(`
      quote_id,
      service,
      offer_price,
      status
    `)
    .eq("partner_id", partnerId)
    .in("status", [
      "selected",
      "valittu",
      "accepted",
    ]);

  if (offersError) {
    throw offersError;
  }

  const offers = offerRows ?? [];

  if (offers.length === 0) {
    return;
  }

  const quoteIds = Array.from(
    new Set(
      offers.map((offer) =>
        String(offer.quote_id),
      ),
    ),
  );

  const {
    data: quoteRows,
    error: quotesError,
  } = await supabase
    .from("request_quotes")
    .select(`
      id,
      status,
      email,
      date,
      guests,
      name,
      phone,
      location,
      event_type
    `)
    .in("id", quoteIds)
    .in("status", [
      "confirmed",
      "suljettu",
    ])
    .gte("date", rangeStart)
    .lte("date", rangeEnd);

  if (quotesError) {
    throw quotesError;
  }

  const quotesById = new Map(
    (quoteRows ?? []).map(
      (quote) => [
        String(quote.id),
        quote,
      ],
    ),
  );

  offers.forEach((offer) => {
    const quote =
      quotesById.get(
        String(offer.quote_id),
      );

    if (!quote?.date) {
      return;
    }

    addBooking(
      bookingsByDate,
      quote.date,
      {
        source: "category",
        requestId: String(
          quote.id,
        ),

        customerName:
          quote.name ?? null,

        customerEmail:
          quote.email ?? null,

        customerPhone:
          quote.phone ?? null,

        eventType:
          quote.event_type ?? null,

        location:
          quote.location ?? null,

        guests:
          quote.guests === null ||
          quote.guests === undefined
            ? null
            : Number(
                quote.guests,
              ),

        service:
          offer.service ?? null,

        price:
          offer.offer_price === null ||
          offer.offer_price ===
            undefined
            ? null
            : Number(
                offer.offer_price,
              ),
      },
    );
  });
}

type BookingLoaderArguments = {
  partnerId: string;
  rangeStart: string;
  rangeEnd: string;
  bookingsByDate: Map<
    string,
    CalendarBookingDetails[]
  >;
};

function addBooking(
  bookingsByDate: Map<
    string,
    CalendarBookingDetails[]
  >,
  date: string,
  booking: CalendarBookingDetails,
) {
  const current =
    bookingsByDate.get(date) ?? [];

  bookingsByDate.set(date, [
    ...current,
    booking,
  ]);
}