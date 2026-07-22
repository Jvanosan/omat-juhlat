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
  },
);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const partnerId = String(
      body.partnerId ?? "",
    ).trim();

    const customerName = String(
      body.customerName ?? "",
    ).trim();

    const customerEmail = String(
      body.customerEmail ?? "",
    )
      .trim()
      .toLowerCase();

    const title = String(
      body.title ?? "",
    ).trim();

    const review = String(
      body.review ?? "",
    ).trim();

    const rating = Number(body.rating);

    // Piilotettu roskapostikenttä.
    const website = String(
      body.website ?? "",
    ).trim();

    if (website) {
      return NextResponse.json({
        success: true,
      });
    }

    if (
      !partnerId ||
      !customerName ||
      !customerEmail ||
      !review
    ) {
      return NextResponse.json(
        {
          error:
            "Täytä nimi, sähköpostiosoite ja arvostelu.",
        },
        { status: 400 },
      );
    }

    if (
      customerName.length < 2 ||
      customerName.length > 80
    ) {
      return NextResponse.json(
        {
          error:
            "Nimen täytyy olla 2–80 merkkiä.",
        },
        { status: 400 },
      );
    }

    if (!isValidEmail(customerEmail)) {
      return NextResponse.json(
        {
          error:
            "Anna kelvollinen sähköpostiosoite.",
        },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          error:
            "Arvosanan täytyy olla 1–5.",
        },
        { status: 400 },
      );
    }

    if (title.length > 120) {
      return NextResponse.json(
        {
          error:
            "Otsikko voi olla enintään 120 merkkiä.",
        },
        { status: 400 },
      );
    }

    if (
      review.length < 10 ||
      review.length > 1000
    ) {
      return NextResponse.json(
        {
          error:
            "Arvostelun täytyy olla 10–1000 merkkiä.",
        },
        { status: 400 },
      );
    }

    // Tarkistetaan, että partneri on julkinen.
    const {
      data: partner,
      error: partnerError,
    } = await supabase
      .from("partners")
      .select(
        "id, status, profile_completed",
      )
      .eq("id", partnerId)
      .eq("status", "approved")
      .eq("profile_completed", true)
      .maybeSingle();

    if (partnerError) {
      console.error(
        "REVIEW PARTNER CHECK ERROR:",
        partnerError,
      );

      return NextResponse.json(
        {
          error:
            "Palveluntarjoajan tarkistaminen epäonnistui.",
        },
        { status: 500 },
      );
    }

    if (!partner) {
      return NextResponse.json(
        {
          error:
            "Palveluntarjoajaa ei löytynyt.",
        },
        { status: 404 },
      );
    }

    // Sama sähköposti voi arvostella partnerin vain kerran.
    const {
      data: existingReview,
      error: existingReviewError,
    } = await supabase
      .from("partner_reviews")
      .select("id")
      .eq("partner_id", partnerId)
      .eq(
        "customer_email",
        customerEmail,
      )
      .limit(1)
      .maybeSingle();

    if (existingReviewError) {
      console.error(
        "EXISTING REVIEW CHECK ERROR:",
        existingReviewError,
      );

      return NextResponse.json(
        {
          error:
            "Aikaisempaa arvostelua ei voitu tarkistaa.",
        },
        { status: 500 },
      );
    }

    if (existingReview) {
      return NextResponse.json(
        {
          error:
            "Olet jo lähettänyt arvostelun tälle palveluntarjoajalle.",
        },
        { status: 409 },
      );
    }

    let verifiedBooking = false;

    // Tarkistetaan kategoriapohjainen vahvistettu valinta.
    const {
      data: categoryQuotes,
      error: categoryQuotesError,
    } = await supabase
      .from("request_quotes")
      .select("id")
      .eq("email", customerEmail)
      .in("status", [
  "confirmed",
  "suljettu",
]);

    if (categoryQuotesError) {
      console.error(
        "REVIEW CATEGORY QUOTES ERROR:",
        categoryQuotesError,
      );
    } else {
      const quoteIds = (
        categoryQuotes ?? []
      ).map((quote) => quote.id);

      if (quoteIds.length > 0) {
        const {
          data: selectedCategoryOffer,
          error: categoryOfferError,
        } = await supabase
          .from("quote_partners")
          .select("id")
          .in("quote_id", quoteIds)
          .eq("partner_id", partnerId)
          .in("status", [
            "selected",
            "valittu",
            "accepted",
          ])
          .limit(1)
          .maybeSingle();

        if (categoryOfferError) {
          console.error(
            "REVIEW CATEGORY OFFER ERROR:",
            categoryOfferError,
          );
        }

        if (selectedCategoryOffer) {
          verifiedBooking = true;
        }
      }
    }

    // Tarkistetaan suora hyväksytty tarjous.
    if (!verifiedBooking) {
      const {
        data: directRequests,
        error: directRequestsError,
      } = await supabase
        .from("direct_requests")
        .select("id")
        .eq("email", customerEmail);

      if (directRequestsError) {
        console.error(
          "REVIEW DIRECT REQUESTS ERROR:",
          directRequestsError,
        );
      } else {
        const directRequestIds = (
          directRequests ?? []
        ).map(
          (directRequest) =>
            directRequest.id,
        );

        if (
          directRequestIds.length > 0
        ) {
          const {
            data: acceptedDirectOffer,
            error: directOfferError,
          } = await supabase
            .from(
              "direct_request_offers",
            )
            .select("id")
            .in(
              "direct_request_id",
              directRequestIds,
            )
            .eq(
              "partner_id",
              partnerId,
            )
            .eq("status", "accepted")
            .limit(1)
            .maybeSingle();

          if (directOfferError) {
            console.error(
              "REVIEW DIRECT OFFER ERROR:",
              directOfferError,
            );
          }

          if (acceptedDirectOffer) {
            verifiedBooking = true;
          }
        }
      }
    }

    if (!verifiedBooking) {
      return NextResponse.json(
        {
          error:
            "Voit arvostella palveluntarjoajan vasta, kun olet valinnut hänen tarjouksensa.",
        },
        { status: 403 },
      );
    }

    const {
      data: createdReview,
      error: insertError,
    } = await supabase
      .from("partner_reviews")
      .insert({
        partner_id: partnerId,
        customer_email:
          customerEmail,
        customer_name: customerName,
        title: title || null,
        rating,
        review,
        approved: false,
      })
      .select("id")
      .single();

    if (
      insertError ||
      !createdReview
    ) {
      console.error(
        "PARTNER REVIEW INSERT ERROR:",
        insertError,
      );

      return NextResponse.json(
        {
          error:
            "Arvostelun tallentaminen epäonnistui.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        reviewId: createdReview.id,
        message:
          "Kiitos arvostelusta! Arvostelu julkaistaan tarkistuksen jälkeen.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "PARTNER REVIEW API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Palvelimella tapahtui odottamaton virhe.",
      },
      { status: 500 },
    );
  }
}