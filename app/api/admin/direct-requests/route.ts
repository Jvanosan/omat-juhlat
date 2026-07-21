import { NextResponse } from "next/server";

import {
  adminSupabase,
  isAuthorizedAdmin,
} from "@/lib/server/adminAuth";

export async function GET(request: Request) {
  try {
    const authorized = await isAuthorizedAdmin(request);

    if (!authorized) {
      return NextResponse.json(
        { error: "Ei käyttöoikeutta." },
        { status: 403 },
      );
    }

    const {
      data: directRequests,
      error: requestsError,
    } = await adminSupabase
      .from("direct_requests")
      .select(`
        id,
        created_at,
        event_date,
        location,
        guests,
        event_type,
        status
      `)
      .order("created_at", { ascending: false });

    if (requestsError) {
      console.error(
        "ADMIN DIRECT REQUESTS LOAD ERROR:",
        requestsError,
      );

      return NextResponse.json(
        {
          error:
            "Suorien tarjouspyyntöjen hakeminen epäonnistui.",
        },
        { status: 500 },
      );
    }

    const requestIds = (directRequests ?? []).map(
      (item) => item.id,
    );

    if (requestIds.length === 0) {
      return NextResponse.json([]);
    }

    const { data: offers, error: offersError } =
      await adminSupabase
        .from("direct_request_offers")
        .select("direct_request_id")
        .in("direct_request_id", requestIds);

    if (offersError) {
      console.error(
        "ADMIN DIRECT OFFER COUNTS ERROR:",
        offersError,
      );

      return NextResponse.json(
        {
          error:
            "Suorien tarjousten lukumäärän hakeminen epäonnistui.",
        },
        { status: 500 },
      );
    }

    const offerCounts = new Map<string, number>();

    for (const offer of offers ?? []) {
      const requestId = String(offer.direct_request_id);

      offerCounts.set(
        requestId,
        (offerCounts.get(requestId) ?? 0) + 1,
      );
    }

    const result = (directRequests ?? []).map((item) => ({
      ...item,
      offerCount: offerCounts.get(String(item.id)) ?? 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "ADMIN DIRECT REQUESTS API ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Palvelimella tapahtui odottamaton virhe." },
      { status: 500 },
    );
  }
}