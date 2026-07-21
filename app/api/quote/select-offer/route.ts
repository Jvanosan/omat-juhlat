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

function isExpired(value: string | null) {
  if (!value) return false;

  const expirationDate = new Date(
    value.includes("T") ? value : `${value}T23:59:59`,
  );

  if (Number.isNaN(expirationDate.getTime())) {
    return false;
  }

  return expirationDate.getTime() < Date.now();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const quoteId = Number(body.quoteId);
    const offerId = Number(body.offerId);
    const accessToken = String(body.accessToken ?? "").trim();

    if (
      !Number.isInteger(quoteId) ||
      quoteId < 1 ||
      !Number.isInteger(offerId) ||
      offerId < 1 ||
      !accessToken
    ) {
      return NextResponse.json(
        { error: "Valinnan tiedot ovat virheelliset." },
        { status: 400 },
      );
    }

    // Tarkista, että tarjouspyyntö ja token kuuluvat yhteen.
    const { data: quote, error: quoteError } = await supabase
      .from("request_quotes")
      .select("id, status")
      .eq("id", quoteId)
      .eq("access_token", accessToken)
      .maybeSingle();

    if (quoteError) {
      console.error("QUOTE ACCESS ERROR:", quoteError);

      return NextResponse.json(
        { error: "Tarjouspyynnön tarkistaminen epäonnistui." },
        { status: 500 },
      );
    }

    if (!quote) {
      return NextResponse.json(
        { error: "Linkki ei ole voimassa." },
        { status: 403 },
      );
    }

    if (quote.status === "confirmed") {
      return NextResponse.json(
        { error: "Tarjouspyyntö on jo vahvistettu." },
        { status: 409 },
      );
    }

    // Tarkista, että valittu tarjous kuuluu tarjouspyyntöön.
    const { data: offer, error: offerError } = await supabase
      .from("quote_partners")
      .select("id, quote_id, service, status, expires_at")
      .eq("id", offerId)
      .eq("quote_id", quoteId)
      .maybeSingle();

    if (offerError) {
      console.error("OFFER SELECT ERROR:", offerError);

      return NextResponse.json(
        { error: "Tarjouksen tarkistaminen epäonnistui." },
        { status: 500 },
      );
    }

    if (!offer) {
      return NextResponse.json(
        { error: "Tarjousta ei löytynyt." },
        { status: 404 },
      );
    }

    if (isExpired(offer.expires_at)) {
      return NextResponse.json(
        { error: "Tarjous on vanhentunut." },
        { status: 409 },
      );
    }

    if (
      offer.status !== "sent" &&
      offer.status !== "offered" &&
      offer.status !== "selected" &&
      offer.status !== "valittu"
    ) {
      return NextResponse.json(
        { error: "Tarjousta ei voi enää valita." },
        { status: 409 },
      );
    }

    // Merkitse valittu tarjous voittajaksi.
    const { error: winnerError } = await supabase
      .from("quote_partners")
      .update({
        status: "selected",
      })
      .eq("id", offer.id)
      .eq("quote_id", quoteId);

    if (winnerError) {
      console.error("WINNER UPDATE ERROR:", winnerError);

      return NextResponse.json(
        { error: "Tarjouksen valitseminen epäonnistui." },
        { status: 500 },
      );
    }

    // Hylkää saman palvelun muut vielä avoimet tarjoukset.
    const { error: losersError } = await supabase
      .from("quote_partners")
      .update({
        status: "rejected",
      })
      .eq("quote_id", quoteId)
      .eq("service", offer.service)
      .neq("id", offer.id)
      .in("status", ["sent", "offered", "selected", "valittu"]);

    if (losersError) {
      console.error("LOSERS UPDATE ERROR:", losersError);

      return NextResponse.json(
        {
          error:
            "Tarjous valittiin, mutta muiden tarjousten sulkeminen epäonnistui.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      selectedOfferId: offer.id,
    });
  } catch (error) {
    console.error("SELECT OFFER API ERROR:", error);

    return NextResponse.json(
      { error: "Palvelimella tapahtui odottamaton virhe." },
      { status: 500 },
    );
  }
}