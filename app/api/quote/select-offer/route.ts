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

function isExpired(
  value: string | null,
): boolean {
  if (!value) {
    return true;
  }

  const expirationDate =
    new Date(value);

  if (
    Number.isNaN(
      expirationDate.getTime(),
    )
  ) {
    return true;
  }

  return (
    expirationDate.getTime() <=
    Date.now()
  );
}

async function restorePreviousSelection({
  previousSelectionId,
  quoteId,
}: {
  previousSelectionId:
    | number
    | null;
  quoteId: number;
}) {
  if (
    previousSelectionId === null
  ) {
    return;
  }

  const { error } = await supabase
    .from("quote_partners")
    .update({
      status: "selected",
    })
    .eq(
      "id",
      previousSelectionId,
    )
    .eq("quote_id", quoteId)
    .eq("status", "offered");

  if (error) {
    console.error(
      "PREVIOUS SELECTION RESTORE ERROR:",
      error,
    );
  }
}

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
      body as Record<
        string,
        unknown
      >;

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
        "QUOTE ACCESS ERROR:",
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
            "Tarjouspyyntö on jo vahvistettu.",
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
        service,
        status,
        offer_price,
        expires_at
      `)
      .eq("id", offerId)
      .eq("quote_id", quoteId)
      .maybeSingle();

    if (offerError) {
      console.error(
        "OFFER SELECT ERROR:",
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

    if (!offer.service) {
      return NextResponse.json(
        {
          error:
            "Tarjoukselta puuttuu palvelukategoria.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      offer.status ===
        "selected" ||
      offer.status === "valittu"
    ) {
      return NextResponse.json({
        success: true,
        selectedOfferId:
          offer.id,
        alreadySelected: true,
      });
    }

    if (
      offer.status !== "offered"
    ) {
      return NextResponse.json(
        {
          error:
            "Tätä tarjousta ei voi enää valita.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      !Number.isFinite(
        Number(
          offer.offer_price,
        ),
      ) ||
      Number(
        offer.offer_price,
      ) <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Tarjouksen hinta ei ole kelvollinen.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      isExpired(
        offer.expires_at,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Tarjous on vanhentunut.",
        },
        {
          status: 409,
        },
      );
    }

    const {
      data: currentSelections,
      error:
        currentSelectionsError,
    } = await supabase
      .from("quote_partners")
      .select("id")
      .eq("quote_id", quoteId)
      .eq(
        "service",
        offer.service,
      )
      .in("status", [
        "selected",
        "valittu",
      ]);

    if (
      currentSelectionsError
    ) {
      console.error(
        "CURRENT SELECTION LOAD ERROR:",
        currentSelectionsError,
      );

      return NextResponse.json(
        {
          error:
            "Aikaisempaa valintaa ei voitu tarkistaa.",
        },
        {
          status: 500,
        },
      );
    }

    const previousSelection =
      currentSelections?.find(
        (selectedOffer) =>
          Number(
            selectedOffer.id,
          ) !== offer.id,
      ) ?? null;

    const previousSelectionId =
      previousSelection
        ? Number(
            previousSelection.id,
          )
        : null;

    if (
      previousSelectionId !== null
    ) {
      const {
        data: releasedOffer,
        error: releaseError,
      } = await supabase
        .from("quote_partners")
        .update({
          status: "offered",
        })
        .eq(
          "id",
          previousSelectionId,
        )
        .eq("quote_id", quoteId)
        .in("status", [
          "selected",
          "valittu",
        ])
        .select("id")
        .maybeSingle();

      if (
        releaseError ||
        !releasedOffer
      ) {
        console.error(
          "PREVIOUS SELECTION RELEASE ERROR:",
          releaseError,
        );

        return NextResponse.json(
          {
            error:
              "Aikaisemman valinnan vaihtaminen epäonnistui.",
          },
          {
            status: releaseError
              ? 500
              : 409,
          },
        );
      }
    }

    const {
      data: selectedOffer,
      error: winnerError,
    } = await supabase
      .from("quote_partners")
      .update({
        status: "selected",
      })
      .eq("id", offer.id)
      .eq("quote_id", quoteId)
      .eq("status", "offered")
      .select("id")
      .maybeSingle();

    if (winnerError) {
      console.error(
        "WINNER UPDATE ERROR:",
        winnerError,
      );

      await restorePreviousSelection({
        previousSelectionId,
        quoteId,
      });

      if (
        winnerError.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            error:
              "Tälle palvelulle ehdittiin juuri valita toinen tarjous.",
          },
          {
            status: 409,
          },
        );
      }

      return NextResponse.json(
        {
          error:
            "Tarjouksen valitseminen epäonnistui.",
        },
        {
          status: 500,
        },
      );
    }

    if (!selectedOffer) {
      await restorePreviousSelection({
        previousSelectionId,
        quoteId,
      });

      return NextResponse.json(
        {
          error:
            "Tarjouksen tila muuttui juuri. Päivitä sivu ja yritä uudelleen.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json({
      success: true,
      selectedOfferId:
        selectedOffer.id,
      replacedOfferId:
        previousSelectionId,
    });
  } catch (error) {
    console.error(
      "SELECT OFFER API ERROR:",
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