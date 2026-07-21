import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

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
    const { id } = await context.params;
    const directRequestId = String(id ?? "").trim();

    const { searchParams } = new URL(request.url);
    const accessToken = String(
      searchParams.get("token") ?? ""
    ).trim();

    if (!directRequestId || !accessToken) {
      return NextResponse.json(
        { error: "Linkki ei ole voimassa." },
        { status: 400 }
      );
    }

    // Tarkista suoran tarjouspyynnön ID ja turvallinen token.
    // Asiakkaan sähköpostia ei palauteta selaimelle.
    const { data: directRequest, error: requestError } =
      await supabase
        .from("direct_requests")
        .select(`
          id,
          event_date,
          location,
          guests,
          status,
          event_type,
          created_at
        `)
        .eq("id", directRequestId)
        .eq("access_token", accessToken)
        .maybeSingle();

    if (requestError) {
      console.error(
        "CUSTOMER DIRECT REQUEST ERROR:",
        requestError
      );

      return NextResponse.json(
        { error: "Tarjouspyynnön hakeminen epäonnistui." },
        { status: 500 }
      );
    }

    if (!directRequest) {
      return NextResponse.json(
        { error: "Linkki ei ole voimassa." },
        { status: 403 }
      );
    }

    // Asiakkaalle näytetään vain lähetetyt tai hyväksytyt tarjoukset.
    const { data: offerRows, error: offersError } =
      await supabase
        .from("direct_request_offers")
        .select(`
          id,
          status,
          price,
          message,
          expires_at,
          created_at,
          partner_id
        `)
        .eq("direct_request_id", directRequestId)
        .in("status", ["sent", "accepted"])
        .order("created_at", { ascending: false });

    if (offersError) {
      console.error(
        "CUSTOMER DIRECT OFFERS ERROR:",
        offersError
      );

      return NextResponse.json(
        { error: "Tarjousten hakeminen epäonnistui." },
        { status: 500 }
      );
    }

    const offers = offerRows ?? [];

    if (offers.length === 0) {
      return NextResponse.json({
        request: directRequest,
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

    const [
      { data: partners, error: partnersError },
      { data: reviews, error: reviewsError },
    ] = await Promise.all([
      supabase
        .from("partners")
        .select("id, company, images")
        .in("id", partnerIds),

      supabase
        .from("partner_reviews")
        .select("partner_id, rating")
        .in("partner_id", partnerIds)
        .eq("approved", true),
    ]);

    if (partnersError || reviewsError) {
      console.error(
        "CUSTOMER DIRECT PARTNER DATA ERROR:",
        {
          partnersError,
          reviewsError,
        }
      );

      return NextResponse.json(
        {
          error:
            "Palveluntarjoajien hakeminen epäonnistui.",
        },
        { status: 500 }
      );
    }

    const combinedOffers = offers.map((offer) => {
      const partner = partners?.find(
        (item) =>
          String(item.id) === String(offer.partner_id)
      );

      const partnerReviews =
        reviews?.filter(
          (review) =>
            String(review.partner_id) ===
            String(offer.partner_id)
        ) ?? [];

      const averageRating =
        partnerReviews.length > 0
          ? (
              partnerReviews.reduce(
                (sum, review) =>
                  sum + Number(review.rating),
                0
              ) / partnerReviews.length
            ).toFixed(1)
          : null;

      return {
        ...offer,
        partner: partner
          ? {
              ...partner,
              averageRating,
              reviewCount: partnerReviews.length,
            }
          : null,
      };
    });

    return NextResponse.json({
      request: directRequest,
      offers: combinedOffers,
    });
  } catch (error) {
    console.error(
      "CUSTOMER DIRECT REQUEST API ERROR:",
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