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

type RequestType =
  | "direct"
  | "category";

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

function isValidUuid(
  value: string,
): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function contactResponse({
  name,
  email,
  phone,
}: {
  name: unknown;
  email: unknown;
  phone: unknown;
}) {
  const cleanEmail = String(
    email ?? "",
  ).trim();

  if (!cleanEmail) {
    return NextResponse.json(
      {
        error:
          "Asiakkaan yhteystietoja ei löytynyt.",
      },
      {
        status: 404,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }

  return NextResponse.json(
    {
      contact: {
        name:
          String(name ?? "").trim() ||
          null,
        email: cleanEmail,
        phone:
          String(phone ?? "").trim() ||
          null,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}

async function getDirectContact({
  requestId,
  partnerId,
}: {
  requestId: string;
  partnerId: string;
}) {
  if (!isValidUuid(requestId)) {
    return NextResponse.json(
      {
        error:
          "Tarjouspyynnön tunniste ei ole kelvollinen.",
      },
      {
        status: 400,
      },
    );
  }

  const {
    data: acceptedOffers,
    error: offerError,
  } = await supabase
    .from(
      "direct_request_offers",
    )
    .select("id")
    .eq(
      "direct_request_id",
      requestId,
    )
    .eq("partner_id", partnerId)
    .eq("status", "accepted")
    .limit(1);

  if (offerError) {
    console.error(
      "DIRECT CONTACT OFFER CHECK ERROR:",
      offerError,
    );

    return NextResponse.json(
      {
        error:
          "Tarjouksen hyväksyntää ei voitu tarkistaa.",
      },
      {
        status: 500,
      },
    );
  }

  if (
    !acceptedOffers ||
    acceptedOffers.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "Asiakkaan yhteystiedot näkyvät vasta, kun asiakas on hyväksynyt tarjouksesi.",
      },
      {
        status: 403,
      },
    );
  }

  const {
    data: directRequest,
    error: requestError,
  } = await supabase
    .from("direct_requests")
    .select(`
      customer_name,
      email,
      phone,
      status
    `)
    .eq("id", requestId)
    .eq("status", "accepted")
    .maybeSingle();

  if (requestError) {
    console.error(
      "DIRECT CONTACT REQUEST ERROR:",
      requestError,
    );

    return NextResponse.json(
      {
        error:
          "Asiakkaan yhteystietoja ei voitu hakea.",
      },
      {
        status: 500,
      },
    );
  }

  if (!directRequest) {
    return NextResponse.json(
      {
        error:
          "Hyväksyttyä tarjouspyyntöä ei löytynyt.",
      },
      {
        status: 404,
      },
    );
  }

  return contactResponse({
    name:
      directRequest.customer_name,
    email: directRequest.email,
    phone: directRequest.phone,
  });
}

async function getCategoryContact({
  requestId,
  partnerId,
}: {
  requestId: string;
  partnerId: string;
}) {
  const numericRequestId =
    Number(requestId);

  if (
    !Number.isInteger(
      numericRequestId,
    ) ||
    numericRequestId < 1
  ) {
    return NextResponse.json(
      {
        error:
          "Tarjouspyynnön tunniste ei ole kelvollinen.",
      },
      {
        status: 400,
      },
    );
  }

  const {
    data: selectedOffers,
    error: offerError,
  } = await supabase
    .from("quote_partners")
    .select("id")
    .eq(
      "quote_id",
      numericRequestId,
    )
    .eq("partner_id", partnerId)
    .in("status", [
      "selected",
      "valittu",
    ])
    .limit(1);

  if (offerError) {
    console.error(
      "CATEGORY CONTACT OFFER CHECK ERROR:",
      offerError,
    );

    return NextResponse.json(
      {
        error:
          "Tarjouksen valintaa ei voitu tarkistaa.",
      },
      {
        status: 500,
      },
    );
  }

  if (
    !selectedOffers ||
    selectedOffers.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "Asiakkaan yhteystiedot näkyvät vain valitulle palveluntarjoajalle.",
      },
      {
        status: 403,
      },
    );
  }

  const {
    data: quote,
    error: quoteError,
  } = await supabase
    .from("request_quotes")
    .select(`
      name,
      email,
      phone,
      status
    `)
    .eq("id", numericRequestId)
    .eq("status", "confirmed")
    .maybeSingle();

  if (quoteError) {
    console.error(
      "CATEGORY CONTACT REQUEST ERROR:",
      quoteError,
    );

    return NextResponse.json(
      {
        error:
          "Asiakkaan yhteystietoja ei voitu hakea.",
      },
      {
        status: 500,
      },
    );
  }

  if (!quote) {
    return NextResponse.json(
      {
        error:
          "Tarjouspyyntöä ei ole vielä vahvistettu.",
      },
      {
        status: 403,
      },
    );
  }

  return contactResponse({
    name: quote.name,
    email: quote.email,
    phone: quote.phone,
  });
}

export async function POST(
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
        "CUSTOMER CONTACT PARTNER ERROR:",
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

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Pyynnön tiedot eivät ole kelvollisia.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error:
            "Pyynnön tiedot puuttuvat.",
        },
        {
          status: 400,
        },
      );
    }

    const requestBody =
      body as Record<
        string,
        unknown
      >;

    const requestType = String(
      requestBody.requestType ?? "",
    ) as RequestType;

    const requestId = String(
      requestBody.requestId ?? "",
    ).trim();

    if (
      (
        requestType !== "direct" &&
        requestType !== "category"
      ) ||
      !requestId
    ) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön tiedot ovat virheelliset.",
        },
        {
          status: 400,
        },
      );
    }

    const partnerId = String(
      partner.id,
    );

    if (
      requestType === "direct"
    ) {
      return getDirectContact({
        requestId,
        partnerId,
      });
    }

    return getCategoryContact({
      requestId,
      partnerId,
    });
  } catch (error) {
    console.error(
      "PARTNER CUSTOMER CONTACT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Palvelimella tapahtui odottamaton virhe.",
      },
      {
        status: 500,
      },
    );
  }
}