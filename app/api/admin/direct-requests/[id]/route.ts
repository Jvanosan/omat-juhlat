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
  context: RouteContext,
) {
  try {
    const authorized = await isAuthorizedAdmin(request);

    if (!authorized) {
      return NextResponse.json(
        { error: "Ei käyttöoikeutta." },
        { status: 403 },
      );
    }

    const { id } = await context.params;
    const requestId = String(id ?? "").trim();

    if (!requestId) {
      return NextResponse.json(
        { error: "Tarjouspyynnön tunnus puuttuu." },
        { status: 400 },
      );
    }

    const {
      data: directRequest,
      error: requestError,
    } = await adminSupabase
      .from("direct_requests")
      .select(`
        id,
        created_at,
        updated_at,
        status,
        viewed,
        customer_name,
        email,
        phone,
        event_type,
        event_date,
        location,
        guests,
        budget,
        services,
        notes,
        partner_ids
      `)
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) {
      console.error(
        "ADMIN DIRECT REQUEST LOAD ERROR:",
        requestError,
      );

      return NextResponse.json(
        { error: "Suoran tarjouspyynnön hakeminen epäonnistui." },
        { status: 500 },
      );
    }

    if (!directRequest) {
      return NextResponse.json(
        { error: "Suoraa tarjouspyyntöä ei löytynyt." },
        { status: 404 },
      );
    }

    const { data: offerRows, error: offersError } =
      await adminSupabase
        .from("direct_request_offers")
        .select(`
          id,
          direct_request_id,
          partner_id,
          price,
          message,
          status,
          expires_at,
          created_at,
          updated_at
        `)
        .eq("direct_request_id", requestId)
        .order("created_at", { ascending: false });

    if (offersError) {
      console.error(
        "ADMIN DIRECT OFFERS LOAD ERROR:",
        offersError,
      );

      return NextResponse.json(
        { error: "Tarjousten hakeminen epäonnistui." },
        { status: 500 },
      );
    }

    const partnerIds = Array.from(
      new Set([
        ...(directRequest.partner_ids ?? []),
        ...(offerRows ?? []).map((offer) => offer.partner_id),
      ]),
    ).filter(Boolean);

    const { data: partners, error: partnersError } =
      partnerIds.length > 0
        ? await adminSupabase
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
            .in("id", partnerIds)
        : { data: [], error: null };

    if (partnersError) {
      console.error(
        "ADMIN DIRECT PARTNERS LOAD ERROR:",
        partnersError,
      );

      return NextResponse.json(
        { error: "Partnerien hakeminen epäonnistui." },
        { status: 500 },
      );
    }

    const offers = (offerRows ?? []).map((offer) => ({
      ...offer,
      partner:
        partners?.find(
          (partner) =>
            String(partner.id) === String(offer.partner_id),
        ) ?? null,
    }));

    const assignedPartners = (partners ?? []).filter((partner) =>
      (directRequest.partner_ids ?? []).some(
        (partnerId: string) =>
          String(partnerId) === String(partner.id),
      ),
    );

    return NextResponse.json({
      request: directRequest,
      offers,
      assignedPartners,
    });
  } catch (error) {
    console.error(
      "ADMIN DIRECT REQUEST API ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Palvelimella tapahtui odottamaton virhe." },
      { status: 500 },
    );
  }
}