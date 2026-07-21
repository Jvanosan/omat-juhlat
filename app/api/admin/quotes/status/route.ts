import { NextResponse } from "next/server";

import {
  adminSupabase,
  isAuthorizedAdmin,
} from "@/lib/server/adminAuth";

const ALLOWED_STATUSES = [
  "avoin",
  "käsittelyssä",
  "suljettu",
] as const;

export async function POST(request: Request) {
  try {
    const authorized =
      await isAuthorizedAdmin(request);

    if (!authorized) {
      return NextResponse.json(
        {
          error:
            "Sinulla ei ole oikeutta muuttaa tarjouspyynnön tilaa.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const quoteId = Number(body.quoteId);
    const status = String(
      body.status ?? ""
    ).trim();

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

    if (
      !ALLOWED_STATUSES.includes(
        status as (typeof ALLOWED_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön tila ei ole kelvollinen.",
        },
        { status: 400 }
      );
    }

    const {
      data: existingQuote,
      error: quoteError,
    } = await adminSupabase
      .from("request_quotes")
      .select("id, status")
      .eq("id", quoteId)
      .maybeSingle();

    if (quoteError) {
      console.error(
        "ADMIN QUOTE STATUS LOAD ERROR:",
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

    if (!existingQuote) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyyntöä ei löytynyt.",
        },
        { status: 404 }
      );
    }

    // Asiakkaan vahvistamaa pyyntöä ei saa avata
    // uudelleen adminin tavallisella statuspainikkeella.
    if (
      existingQuote.status === "confirmed"
    ) {
      return NextResponse.json(
        {
          error:
            "Vahvistettua tarjouspyyntöä ei voi muuttaa.",
        },
        { status: 409 }
      );
    }

    if (existingQuote.status === status) {
      return NextResponse.json({
        success: true,
        status,
        unchanged: true,
      });
    }

    const { error: updateError } =
      await adminSupabase
        .from("request_quotes")
        .update({ status })
        .eq("id", quoteId);

    if (updateError) {
      console.error(
        "ADMIN QUOTE STATUS UPDATE ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön tilan päivittäminen epäonnistui.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error(
      "ADMIN QUOTE STATUS API ERROR:",
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