import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Supabase-palvelimen ympäristömuuttujat puuttuvat.",
  );
}

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

type CalendarBookingResponse = {
  date: string;
  source: "direct" | "category";
  requestId: string;

  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;

  eventType: string | null;
  location: string | null;
  guests: number | null;

  service: string | null;
  price: number | null;
};

function getAccessToken(
  request: Request,
): string | null {
  const authorization =
    request.headers.get(
      "authorization",
    );

  if (
    !authorization ||
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    return null;
  }

  const token = authorization
    .slice("Bearer ".length)
    .trim();

  return token || null;
}

function isValidDateKey(
  value: string,
): boolean {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  ) {
    return false;
  }

  const date = new Date(
    `${value}T00:00:00Z`,
  );

  return !Number.isNaN(
    date.getTime(),
  );
}

function isValidRange(
  rangeStart: string,
  rangeEnd: string,
): boolean {
  if (
    !isValidDateKey(rangeStart) ||
    !isValidDateKey(rangeEnd)
  ) {
    return false;
  }

  const start = new Date(
    `${rangeStart}T00:00:00Z`,
  );

  const end = new Date(
    `${rangeEnd}T00:00:00Z`,
  );

  const dayDifference =
    (end.getTime() -
      start.getTime()) /
    (24 * 60 * 60 * 1000);

  return (
    dayDifference >= 0 &&
    dayDifference <= 62
  );
}

function nullableText(
  value: unknown,
): string | null {
  const text = String(
    value ?? "",
  ).trim();

  return text || null;
}

function nullableNumber(
  value: unknown,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numberValue =
    Number(value);

  return Number.isFinite(
    numberValue,
  )
    ? numberValue
    : null;
}

async function loadDirectBookings({
  partnerId,
  rangeStart,
  rangeEnd,
}: {
  partnerId: string;
  rangeStart: string;
  rangeEnd: string;
}): Promise<
  CalendarBookingResponse[]
> {
  const {
    data: offerRows,
    error: offerError,
  } = await supabase
    .from(
      "direct_request_offers",
    )
    .select(`
      direct_request_id,
      price
    `)
    .eq("partner_id", partnerId)
    .eq("status", "accepted");

  if (offerError) {
    throw offerError;
  }

  const offers =
    offerRows ?? [];

  if (offers.length === 0) {
    return [];
  }

  const requestIds =
    Array.from(
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
    error: requestError,
  } = await supabase
    .from("direct_requests")
    .select(`
      id,
      status,
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
    .eq("status", "accepted")
    .gte(
      "event_date",
      rangeStart,
    )
    .lte(
      "event_date",
      rangeEnd,
    );

  if (requestError) {
    throw requestError;
  }

  const requestsById =
    new Map(
      (requestRows ?? []).map(
        (directRequest) => [
          String(
            directRequest.id,
          ),
          directRequest,
        ],
      ),
    );

  return offers.flatMap(
    (offer) => {
      const directRequest =
        requestsById.get(
          String(
            offer.direct_request_id,
          ),
        );

      if (
        !directRequest?.event_date
      ) {
        return [];
      }

      return [
        {
          date:
            directRequest.event_date,

          source:
            "direct" as const,

          requestId: String(
            directRequest.id,
          ),

          customerName:
            nullableText(
              directRequest.customer_name,
            ),

          customerEmail:
            nullableText(
              directRequest.email,
            ),

          customerPhone:
            nullableText(
              directRequest.phone,
            ),

          eventType:
            nullableText(
              directRequest.event_type,
            ),

          location:
            nullableText(
              directRequest.location,
            ),

          guests:
            nullableNumber(
              directRequest.guests,
            ),

          service:
            nullableText(
              directRequest.services,
            ),

          price:
            nullableNumber(
              offer.price,
            ),
        },
      ];
    },
  );
}

async function loadCategoryBookings({
  partnerId,
  rangeStart,
  rangeEnd,
}: {
  partnerId: string;
  rangeStart: string;
  rangeEnd: string;
}): Promise<
  CalendarBookingResponse[]
> {
  const {
    data: offerRows,
    error: offerError,
  } = await supabase
    .from("quote_partners")
    .select(`
      quote_id,
      service,
      offer_price
    `)
    .eq("partner_id", partnerId)
    .in("status", [
      "selected",
      "valittu",
    ]);

  if (offerError) {
    throw offerError;
  }

  const offers =
    offerRows ?? [];

  if (offers.length === 0) {
    return [];
  }

  const quoteIds =
    Array.from(
      new Set(
        offers.map((offer) =>
          String(
            offer.quote_id,
          ),
        ),
      ),
    );

  const {
    data: quoteRows,
    error: quoteError,
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
    .eq("status", "confirmed")
    .gte("date", rangeStart)
    .lte("date", rangeEnd);

  if (quoteError) {
    throw quoteError;
  }

  const quotesById =
    new Map(
      (quoteRows ?? []).map(
        (quote) => [
          String(quote.id),
          quote,
        ],
      ),
    );

  return offers.flatMap(
    (offer) => {
      const quote =
        quotesById.get(
          String(
            offer.quote_id,
          ),
        );

      if (!quote?.date) {
        return [];
      }

      return [
        {
          date: quote.date,

          source:
            "category" as const,

          requestId:
            String(quote.id),

          customerName:
            nullableText(
              quote.name,
            ),

          customerEmail:
            nullableText(
              quote.email,
            ),

          customerPhone:
            nullableText(
              quote.phone,
            ),

          eventType:
            nullableText(
              quote.event_type,
            ),

          location:
            nullableText(
              quote.location,
            ),

          guests:
            nullableNumber(
              quote.guests,
            ),

          service:
            nullableText(
              offer.service,
            ),

          price:
            nullableNumber(
              offer.offer_price,
            ),
        },
      ];
    },
  );
}

export async function GET(
  request: Request,
) {
  try {
    const accessToken =
      getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Kirjautuminen vaaditaan.",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser(
        accessToken,
      );

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "Kirjautumisistunto ei ole voimassa.",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: partner,
      error: partnerError,
    } = await supabase
      .from("partners")
      .select("id")
      .eq(
        "auth_user_id",
        user.id,
      )
      .maybeSingle();

    if (partnerError) {
      console.error(
        "CALENDAR BOOKINGS PARTNER ERROR:",
        partnerError,
      );

      return NextResponse.json(
        {
          error:
            "Partneritiliä ei voitu tarkistaa.",
        },
        {
          status: 500,
        },
      );
    }

    if (!partner) {
      return NextResponse.json(
        {
          error:
            "Kirjautuneelle käyttäjälle ei löytynyt partneriprofiilia.",
        },
        {
          status: 403,
        },
      );
    }

    const url =
      new URL(request.url);

    const rangeStart =
      url.searchParams.get(
        "rangeStart",
      ) ?? "";

    const rangeEnd =
      url.searchParams.get(
        "rangeEnd",
      ) ?? "";

    if (
      !isValidRange(
        rangeStart,
        rangeEnd,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Kalenterin päivämääräväli ei ole kelvollinen.",
        },
        {
          status: 400,
        },
      );
    }

    const partnerId =
      String(partner.id);

    const [
      directBookings,
      categoryBookings,
    ] = await Promise.all([
      loadDirectBookings({
        partnerId,
        rangeStart,
        rangeEnd,
      }),

      loadCategoryBookings({
        partnerId,
        rangeStart,
        rangeEnd,
      }),
    ]);

    const bookings = [
      ...directBookings,
      ...categoryBookings,
    ].sort((first, second) =>
      first.date.localeCompare(
        second.date,
      ),
    );

    return NextResponse.json(
      {
        bookings,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "PARTNER CALENDAR BOOKINGS ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Kalenterin varaustietojen hakeminen epäonnistui.",
      },
      {
        status: 500,
      },
    );
  }
}