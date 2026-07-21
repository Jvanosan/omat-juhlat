import { NextResponse } from "next/server";

import {
  adminSupabase,
  isAuthorizedAdmin,
} from "@/lib/server/adminAuth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const authorized =
      await isAuthorizedAdmin(request);

    if (!authorized) {
      return NextResponse.json(
        {
          error:
            "Sinulla ei ole oikeutta nähdä tarjouspyynnön tietoja.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const quoteId = Number(id);

    if (
      !Number.isInteger(quoteId) ||
      quoteId < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön tunnus ei ole kelvollinen.",
        },
        { status: 400 }
      );
    }

    const { data: quote, error: quoteError } =
      await adminSupabase
        .from("request_quotes")
        .select(`
          id,
          status,
          created_at,
          name,
          phone,
          email,
          location,
          date,
          guests,
          budget,
          services,
          extraInfo,
          event_type,
          notes
        `)
        .eq("id", quoteId)
        .maybeSingle();

    if (quoteError) {
      console.error(
        "ADMIN QUOTE DETAIL LOAD ERROR:",
        quoteError
      );

      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön hakeminen epäonnistui.",
        },
        { status: 500 }
      );
    }

    if (!quote) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyyntöä ei löytynyt.",
        },
        { status: 404 }
      );
    }

    const {
      data: offerRows,
      error: offersError,
    } = await adminSupabase
      .from("quote_partners")
      .select(`
        id,
        status,
        created_at,
        partner_id,
        service,
        offer_price,
        offer_message,
        expires_at
      `)
      .eq("quote_id", quoteId)
      .order("created_at", {
        ascending: false,
      });

    if (offersError) {
      console.error(
        "ADMIN QUOTE OFFERS LOAD ERROR:",
        offersError
      );

      return NextResponse.json(
        {
          error:
            "Tarjousten hakeminen epäonnistui.",
        },
        { status: 500 }
      );
    }

    const offers = offerRows ?? [];

    if (offers.length === 0) {
      return NextResponse.json({
        quote,
        offers: [],
      });
    }

    const partnerIds = Array.from(
      new Set(
        offers
          .map((offer) => offer.partner_id)
          .filter(Boolean)
      )
    );

    const {
      data: partners,
      error: partnersError,
    } = await adminSupabase
      .from("partners")
      .select(`
        id,
        company,
        email,
        phone,
        area,
        category,
        services,
        logo_url,
        images,
        status
      `)
      .in("id", partnerIds);

    if (partnersError) {
      console.error(
        "ADMIN QUOTE PARTNERS LOAD ERROR:",
        partnersError
      );

      return NextResponse.json(
        {
          error:
            "Partnerien hakeminen epäonnistui.",
        },
        { status: 500 }
      );
    }

    const combinedOffers = offers.map(
      (offer) => ({
        ...offer,
        partner:
          partners?.find(
            (partner) =>
              String(partner.id) ===
              String(offer.partner_id)
          ) ?? null,
      })
    );

    return NextResponse.json({
      quote,
      offers: combinedOffers,
    });
  } catch (error) {
    console.error(
      "ADMIN QUOTE DETAIL API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Palvelimella tapahtui odottamaton virhe.",
      },
      { status: 500 }
    );
  }
}