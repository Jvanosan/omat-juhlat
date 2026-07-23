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

export async function POST(
  request: Request,
) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Valinnan tiedot eivät ole kelvollisia.",
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
            "Valinnan tiedot puuttuvat.",
        },
        {
          status: 400,
        },
      );
    }

    const requestBody =
      body as Record<string, unknown>;

    const quoteId = Number(
      requestBody.quoteId,
    );

    const offerId = Number(
      requestBody.offerId,
    );

    const accessToken = String(
      requestBody.accessToken ?? "",
    ).trim();

    if (
      !Number.isInteger(quoteId) ||
      quoteId < 1 ||
      !Number.isInteger(offerId) ||
      offerId < 1 ||
      !accessToken
    ) {
      return NextResponse.json(
        {
          error:
            "Valinnan tiedot ovat virheelliset.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: quote,
      error: quoteError,
    } = await supabase
      .from("request_quotes")
      .select("id, status")
      .eq("id", quoteId)
      .eq(
        "access_token",
        accessToken,
      )
      .maybeSingle();

    if (quoteError) {
      console.error(
        "REMOVE SELECTION QUOTE ERROR:",
        quoteError,
      );

      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön tarkistaminen epäonnistui.",
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
            "Linkki ei ole voimassa.",
        },
        {
          status: 403,
        },
      );
    }

    if (
      quote.status === "confirmed" ||
      quote.status === "suljettu"
    ) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyyntö on jo vahvistettu, eikä valintoja voi enää muuttaa.",
        },
        {
          status: 409,
        },
      );
    }

    const {
      data: offer,
      error: offerError,
    } = await supabase
      .from("quote_partners")
      .select(`
        id,
        quote_id,
        status
      `)
      .eq("id", offerId)
      .eq("quote_id", quoteId)
      .maybeSingle();

    if (offerError) {
      console.error(
        "REMOVE SELECTION OFFER ERROR:",
        offerError,
      );

      return NextResponse.json(
        {
          error:
            "Tarjouksen tarkistaminen epäonnistui.",
        },
        {
          status: 500,
        },
      );
    }

    if (!offer) {
      return NextResponse.json(
        {
          error:
            "Tarjousta ei löytynyt.",
        },
        {
          status: 404,
        },
      );
    }

    if (offer.status === "offered") {
      return NextResponse.json({
        success: true,
        removedOfferId: offer.id,
        alreadyRemoved: true,
      });
    }

    if (
      offer.status !== "selected" &&
      offer.status !== "valittu"
    ) {
      return NextResponse.json(
        {
          error:
            "Tätä valintaa ei voi poistaa.",
        },
        {
          status: 409,
        },
      );
    }

    const {
      data: removedOffer,
      error: updateError,
    } = await supabase
      .from("quote_partners")
      .update({
        status: "offered",
      })
      .eq("id", offer.id)
      .eq("quote_id", quoteId)
      .in("status", [
        "selected",
        "valittu",
      ])
      .select("id")
      .maybeSingle();

    if (updateError) {
      console.error(
        "REMOVE SELECTION UPDATE ERROR:",
        updateError,
      );

      return NextResponse.json(
        {
          error:
            "Valinnan poistaminen epäonnistui.",
        },
        {
          status: 500,
        },
      );
    }

    if (!removedOffer) {
      return NextResponse.json(
        {
          error:
            "Valinnan tila muuttui juuri. Päivitä sivu ja yritä uudelleen.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json({
      success: true,
      removedOfferId:
        removedOffer.id,
    });
  } catch (error) {
    console.error(
      "REMOVE SELECTION API ERROR:",
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