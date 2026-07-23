import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  releaseCompetingQuoteSelections,
} from "@/lib/server/releaseCompetingQuoteSelections";
import {
  createCustomerEmail,
  createLoserEmail,
  createWinnerEmail,
} from "./confirmationEmails";

import {
  isExpired,
  sendEmail,
} from "./confirmationUtils";

import type {
  ConfirmationPartner,
  ConfirmationQuote,
  QuotePartnerOffer,
} from "./types";

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

async function deleteCalendarEntries(
  entryIds: Array<
    string | number
  >,
) {
  if (entryIds.length === 0) {
    return;
  }

  const { error } = await supabase
    .from(
      "partner_calendar_entries",
    )
    .delete()
    .in("id", entryIds);

  if (error) {
    console.error(
      "QUOTE CALENDAR ROLLBACK ERROR:",
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
            "Vahvistuksen tiedot eivät ole kelvollisia.",
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
            "Vahvistuksen tiedot puuttuvat.",
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

    const accessToken = String(
      requestBody.accessToken ?? "",
    ).trim();

    if (
      !Number.isInteger(quoteId) ||
      quoteId < 1 ||
      !accessToken
    ) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön tunniste puuttuu tai on virheellinen.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: quoteData,
      error: quoteError,
    } = await supabase
      .from("request_quotes")
      .select(`
        id,
        status,
        date,
        event_type,
        location,
        guests,
        name,
        email,
        phone
      `)
      .eq("id", quoteId)
      .eq(
        "access_token",
        accessToken,
      )
      .maybeSingle();

    if (quoteError) {
      console.error(
        "QUOTE ACCESS CHECK ERROR:",
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

    if (!quoteData) {
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

    const quote =
      quoteData as ConfirmationQuote;

    if (
      quote.status === "confirmed" ||
      quote.status === "suljettu"
    ) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyyntö on jo vahvistettu.",
          alreadyConfirmed: true,
        },
        {
          status: 409,
        },
      );
    }

    if (!quote.date) {
      return NextResponse.json(
        {
          error:
            "Tarjouspyynnöltä puuttuu tapahtuman päivämäärä.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: offerData,
      error: offersError,
    } = await supabase
      .from("quote_partners")
      .select(`
        id,
        partner_id,
        service,
        status,
        offer_price,
        offer_message,
        expires_at
      `)
      .eq("quote_id", quoteId);

    if (offersError) {
      console.error(
        "QUOTE OFFERS LOAD ERROR:",
        offersError,
      );

      return NextResponse.json(
        {
          error:
            "Tarjouksia ei voitu tarkistaa.",
        },
        {
          status: 500,
        },
      );
    }

    const offers =
      (offerData ??
        []) as QuotePartnerOffer[];

    const winners = offers.filter(
      (offer) =>
        offer.status ===
          "selected" ||
        offer.status ===
          "valittu",
    );

    if (winners.length === 0) {
      return NextResponse.json(
        {
          error:
            "Yhtään palveluntarjoajaa ei ole valittu.",
        },
        {
          status: 400,
        },
      );
    }

    const invalidWinner =
      winners.find(
        (winner) =>
          !Number.isFinite(
            Number(
              winner.offer_price,
            ),
          ) ||
          Number(
            winner.offer_price,
          ) <= 0,
      );

    if (invalidWinner) {
      return NextResponse.json(
        {
          error:
            "Yhden valitun tarjouksen hinta ei ole kelvollinen.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      winners.some((winner) =>
        isExpired(
          winner.expires_at,
        ),
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Yksi valituista tarjouksista on vanhentunut. Palaa tarjouksiin ja tee uusi valinta.",
        },
        {
          status: 409,
        },
      );
    }

    const winnerPartnerIds =
      Array.from(
        new Set(
          winners.map((winner) =>
            String(
              winner.partner_id,
            ),
          ),
        ),
      );

    const {
      data: partnerData,
      error: partnersError,
    } = await supabase
      .from("partners")
      .select(
        "id, company, email",
      )
      .in(
        "id",
        winnerPartnerIds,
      );

    if (partnersError) {
      console.error(
        "QUOTE PARTNERS LOAD ERROR:",
        partnersError,
      );

      return NextResponse.json(
        {
          error:
            "Valittujen palveluntarjoajien tietoja ei voitu hakea.",
        },
        {
          status: 500,
        },
      );
    }

    const partners =
      (partnerData ??
        []) as ConfirmationPartner[];

    const partnersById =
      new Map(
        partners.map((partner) => [
          String(partner.id),
          partner,
        ]),
      );

    const missingPartner =
      winnerPartnerIds.some(
        (partnerId) =>
          !partnersById.has(
            partnerId,
          ),
      );

    if (missingPartner) {
      return NextResponse.json(
        {
          error:
            "Yhden valitun palveluntarjoajan tietoja ei löytynyt.",
        },
        {
          status: 409,
        },
      );
    }

    const {
      data:
        existingCalendarEntries,
      error: calendarCheckError,
    } = await supabase
      .from(
        "partner_calendar_entries",
      )
      .select("partner_id")
      .eq("date", quote.date)
      .in(
        "partner_id",
        winnerPartnerIds,
      );

    if (calendarCheckError) {
      console.error(
        "QUOTE CALENDAR CHECK ERROR:",
        calendarCheckError,
      );

      return NextResponse.json(
        {
          error:
            "Palveluntarjoajien saatavuutta ei voitu tarkistaa.",
        },
        {
          status: 500,
        },
      );
    }

    if (
      existingCalendarEntries &&
      existingCalendarEntries.length >
        0
    ) {
      const unavailableIds =
        new Set(
          existingCalendarEntries.map(
            (entry) =>
              String(
                entry.partner_id,
              ),
          ),
        );

      const companies =
        winnerPartnerIds
          .filter((partnerId) =>
            unavailableIds.has(
              partnerId,
            ),
          )
          .map(
            (partnerId) =>
              partnersById.get(
                partnerId,
              )?.company ||
              "Palveluntarjoaja",
          );

      return NextResponse.json(
        {
          error:
            companies.length === 1
              ? `${companies[0]} ei ole enää saatavilla tapahtuman päivänä.`
              : `Seuraavat palveluntarjoajat eivät ole enää saatavilla tapahtuman päivänä: ${companies.join(", ")}.`,
        },
        {
          status: 409,
        },
      );
    }

    const {
      data:
        createdCalendarEntries,
      error: calendarInsertError,
    } = await supabase
      .from(
        "partner_calendar_entries",
      )
      .insert(
        winnerPartnerIds.map(
          (partnerId) => ({
            partner_id: partnerId,
            date: quote.date,
            status: "booked",
            note:
              `OmatJuhlat-varaus – ${
                quote.event_type ||
                "Tapahtuma"
              }${
                quote.location
                  ? `, ${quote.location}`
                  : ""
              }`,
          }),
        ),
      )
      .select("id");

    if (calendarInsertError) {
      console.error(
        "QUOTE CALENDAR INSERT ERROR:",
        calendarInsertError,
      );

      const conflict =
        calendarInsertError.code ===
        "23505";

      return NextResponse.json(
        {
          error: conflict
            ? "Yksi palveluntarjoajista ehti juuri varautua tapahtuman päivälle."
            : "Varauksen lisääminen kalenteriin epäonnistui.",
        },
        {
          status: conflict
            ? 409
            : 500,
        },
      );
    }

    const createdEntryIds =
      (
        createdCalendarEntries ??
        []
      ).map(
        (entry) => entry.id,
      );

    const {
      data: confirmedQuote,
      error: statusUpdateError,
    } = await supabase
      .from("request_quotes")
      .update({
        status: "confirmed",
      })
      .eq("id", quoteId)
      .eq(
        "access_token",
        accessToken,
      )
      .neq(
        "status",
        "confirmed",
      )
      .select("id")
      .maybeSingle();

    if (
      statusUpdateError ||
      !confirmedQuote
    ) {
      console.error(
        "QUOTE STATUS UPDATE ERROR:",
        statusUpdateError,
      );

      await deleteCalendarEntries(
        createdEntryIds,
      );

      return NextResponse.json(
        {
          error:
            "Tarjouspyyntö vahvistettiin jo toisessa istunnossa tai vahvistaminen epäonnistui.",
          alreadyConfirmed:
            !statusUpdateError,
        },
        {
          status: statusUpdateError
            ? 500
            : 409,
        },
      );
    }

    const {
      error: closeOffersError,
    } = await supabase
      .from("quote_partners")
      .update({
        status: "rejected",
      })
      .eq("quote_id", quoteId)
      .in("status", [
        "sent",
        "offered",
      ]);

    if (closeOffersError) {
      console.error(
        "QUOTE OFFERS CLOSE ERROR:",
        closeOffersError,
      );

      await supabase
        .from("request_quotes")
        .update({
          status: quote.status,
        })
        .eq("id", quoteId);

      await deleteCalendarEntries(
        createdEntryIds,
      );

      return NextResponse.json(
        {
          error:
            "Muiden tarjousten sulkeminen epäonnistui. Vahvistusta ei tallennettu.",
        },
        {
          status: 500,
        },
      );
    }
let releasedCompetingSelections =
  0;

try {
  const releaseResult =
    await releaseCompetingQuoteSelections({
      partnerIds:
        winnerPartnerIds,
      eventDate: quote.date,
      excludeQuoteId: quoteId,
    });

  releasedCompetingSelections =
    releaseResult.releasedSelections;

  if (
    releasedCompetingSelections >
    0
  ) {
    console.info(
      "COMPETING QUOTE SELECTIONS RELEASED:",
      {
        releasedSelections:
          releasedCompetingSelections,
        affectedQuoteIds:
          releaseResult.affectedQuoteIds,
      },
    );
  }
} catch (releaseError) {
  // Asiakkaan vahvistus on jo onnistunut.
  // Muiden alustavien valintojen vapautuksen
  // virhe ei saa muuttaa onnistunutta varausta
  // epäonnistuneeksi.
  console.error(
    "COMPETING QUOTE SELECTION RELEASE ERROR:",
    releaseError,
  );
}
    const losingOffers =
      offers.filter(
        (offer) =>
          !winners.some(
            (winner) =>
              winner.id ===
              offer.id,
          ) &&
          Number.isFinite(
            Number(
              offer.offer_price,
            ),
          ) &&
          Number(
            offer.offer_price,
          ) > 0,
      );

    const losingPartnerIds =
      Array.from(
        new Set(
          losingOffers.map(
            (offer) =>
              String(
                offer.partner_id,
              ),
          ),
        ),
      ).filter(
        (partnerId) =>
          !winnerPartnerIds.includes(
            partnerId,
          ),
      );

    let losingPartners:
      ConfirmationPartner[] = [];

    if (
      losingPartnerIds.length > 0
    ) {
      const {
        data:
          losingPartnerData,
        error:
          losingPartnersError,
      } = await supabase
        .from("partners")
        .select(
          "id, company, email",
        )
        .in(
          "id",
          losingPartnerIds,
        );

      if (losingPartnersError) {
        console.error(
          "LOSING PARTNERS LOAD ERROR:",
          losingPartnersError,
        );
      } else {
        losingPartners =
          (losingPartnerData ??
            []) as ConfirmationPartner[];
      }
    }

    let winnerEmailsSent = 0;
    let loserEmailsSent = 0;
    let customerEmailSent = false;

    for (
      const partnerId of
      winnerPartnerIds
    ) {
      const partner =
        partnersById.get(
          partnerId,
        );

      if (!partner?.email) {
        continue;
      }

      const partnerOffers =
        winners.filter(
          (winner) =>
            String(
              winner.partner_id,
            ) === partnerId,
        );

      const sent =
        await sendEmail(
          createWinnerEmail({
            partner: {
              ...partner,
              email: partner.email,
            },
            offers:
              partnerOffers,
            quote,
          }),
        );

      if (sent) {
        winnerEmailsSent++;
      }
    }

    for (
      const partner of
      losingPartners
    ) {
      if (!partner.email) {
        continue;
      }

      const sent =
        await sendEmail(
          createLoserEmail({
            partner: {
              ...partner,
              email: partner.email,
            },
          }),
        );

      if (sent) {
        loserEmailsSent++;
      }
    }

    if (quote.email) {
      customerEmailSent =
        await sendEmail(
          createCustomerEmail({
            quote: {
              ...quote,
              email: quote.email,
            },
            winners,
            partnersById,
          }),
        );
    }

    return NextResponse.json({
  success: true,
  winnerEmailsSent,
  loserEmailsSent,
  customerEmailSent,
  releasedCompetingSelections,
});

  } catch (error) {
    console.error(
      "QUOTE CONFIRMATION ERROR:",
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