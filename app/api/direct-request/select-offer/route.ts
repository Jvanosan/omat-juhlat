import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  releaseCompetingQuoteSelections,
} from "@/lib/server/releaseCompetingQuoteSelections";
import {
  createCustomerSelectionEmail,
  createPartnerSelectionEmail,
  type DirectSelectionRequest,
  type SelectedDirectOffer,
  type SelectedDirectPartner,
} from "./selectionEmails";

import {
  isExpired,
  isValidUuid,
  sendEmail,
} from "./selectionUtils";

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

async function deleteCalendarEntry(
  entryId: string | number,
) {
  const { error } = await supabase
    .from(
      "partner_calendar_entries",
    )
    .delete()
    .eq("id", entryId);

  if (error) {
    console.error(
      "DIRECT CALENDAR ROLLBACK ERROR:",
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
            "Valintatiedot eivät ole kelvollisia.",
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
            "Valintatiedot puuttuvat.",
        },
        {
          status: 400,
        },
      );
    }

    const requestBody =
      body as Record<string, unknown>;

    const directRequestId =
      String(
        requestBody.directRequestId ??
          "",
      ).trim();

    const offerId = String(
      requestBody.offerId ?? "",
    ).trim();

    const accessToken = String(
      requestBody.accessToken ?? "",
    ).trim();

    if (
      !directRequestId ||
      !offerId ||
      !accessToken ||
      !isValidUuid(
        directRequestId,
      ) ||
      !isValidUuid(offerId)
    ) {
      return NextResponse.json(
        {
          error:
            "Valintatiedot ovat virheelliset.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: requestData,
      error: requestError,
    } = await supabase
      .from("direct_requests")
      .select(`
        id,
        status,
        email,
        customer_name,
        phone,
        event_date,
        location,
        guests,
        event_type
      `)
      .eq("id", directRequestId)
      .eq(
        "access_token",
        accessToken,
      )
      .maybeSingle();

    if (requestError) {
      console.error(
        "DIRECT OFFER REQUEST ERROR:",
        requestError,
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

    if (!requestData) {
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

    const directRequest =
      requestData as DirectSelectionRequest;

    if (
      directRequest.status ===
      "accepted"
    ) {
      return NextResponse.json(
        {
          error:
            "Tähän tarjouspyyntöön on jo valittu tarjous.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      !directRequest.event_date
    ) {
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
      error: offerError,
    } = await supabase
      .from(
        "direct_request_offers",
      )
      .select(`
        id,
        direct_request_id,
        partner_id,
        status,
        price,
        message,
        expires_at
      `)
      .eq("id", offerId)
      .eq(
        "direct_request_id",
        directRequestId,
      )
      .maybeSingle();

    if (offerError) {
      console.error(
        "DIRECT OFFER LOAD ERROR:",
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

    if (!offerData) {
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

    const offer =
      offerData as SelectedDirectOffer;

    if (
      offer.status === "accepted"
    ) {
      return NextResponse.json({
        success: true,
        selectedOfferId:
          offer.id,
        alreadySelected: true,
      });
    }

    if (offer.status !== "sent") {
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
        Number(offer.price),
      ) ||
      Number(offer.price) <= 0
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
      data: partnerData,
      error: partnerError,
    } = await supabase
      .from("partners")
      .select(`
        id,
        company,
        email
      `)
      .eq(
        "id",
        offer.partner_id,
      )
      .eq("status", "approved")
      .eq(
        "profile_completed",
        true,
      )
      .maybeSingle();

    if (
      partnerError ||
      !partnerData
    ) {
      console.error(
        "DIRECT SELECTED PARTNER ERROR:",
        partnerError,
      );

      return NextResponse.json(
        {
          error:
            "Valittu palveluntarjoaja ei ole enää saatavilla.",
        },
        {
          status: 409,
        },
      );
    }

    const partner =
      partnerData as SelectedDirectPartner;

    const {
      data:
        existingCalendarEntry,
      error: calendarCheckError,
    } = await supabase
      .from(
        "partner_calendar_entries",
      )
      .select("id")
      .eq(
        "partner_id",
        offer.partner_id,
      )
      .eq(
        "date",
        directRequest.event_date,
      )
      .maybeSingle();

    if (calendarCheckError) {
      console.error(
        "DIRECT CALENDAR CHECK ERROR:",
        calendarCheckError,
      );

      return NextResponse.json(
        {
          error:
            "Palveluntarjoajan saatavuutta ei voitu tarkistaa.",
        },
        {
          status: 500,
        },
      );
    }

    if (existingCalendarEntry) {
      return NextResponse.json(
        {
          error:
            "Palveluntarjoaja ei ole enää saatavilla tapahtuman päivänä. Valitse toinen tarjous.",
        },
        {
          status: 409,
        },
      );
    }

    const {
      data: createdCalendarEntry,
      error: calendarInsertError,
    } = await supabase
      .from(
        "partner_calendar_entries",
      )
      .insert({
        partner_id:
          offer.partner_id,
        date:
          directRequest.event_date,
        status: "booked",
        note:
          `OmatJuhlat-varaus – ${
            directRequest.event_type ||
            "Tapahtuma"
          }${
            directRequest.location
              ? `, ${directRequest.location}`
              : ""
          }`,
      })
      .select("id")
      .single();

    if (
      calendarInsertError ||
      !createdCalendarEntry
    ) {
      console.error(
        "DIRECT CALENDAR INSERT ERROR:",
        calendarInsertError,
      );

      const conflict =
        calendarInsertError?.code ===
        "23505";

      return NextResponse.json(
        {
          error: conflict
            ? "Palveluntarjoaja ehti juuri varautua tapahtuman päivälle. Valitse toinen tarjous."
            : "Varauksen lisääminen kalenteriin epäonnistui.",
        },
        {
          status: conflict
            ? 409
            : 500,
        },
      );
    }

    const {
      data: selectedOffer,
      error: selectError,
    } = await supabase
      .from(
        "direct_request_offers",
      )
      .update({
        status: "accepted",
      })
      .eq("id", offer.id)
      .eq(
        "direct_request_id",
        directRequestId,
      )
      .eq("status", "sent")
      .select("id")
      .maybeSingle();

    if (
      selectError ||
      !selectedOffer
    ) {
      console.error(
        "DIRECT OFFER UPDATE ERROR:",
        selectError,
      );

      await deleteCalendarEntry(
        createdCalendarEntry.id,
      );

      if (
        selectError?.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            error:
              "Tähän tarjouspyyntöön ehdittiin juuri valita toinen tarjous.",
          },
          {
            status: 409,
          },
        );
      }

      return NextResponse.json(
        {
          error:
            "Tarjouksen tila muuttui juuri tai tarjouksen valitseminen epäonnistui.",
        },
        {
          status: selectError
            ? 500
            : 409,
        },
      );
    }

    const {
      data: acceptedRequest,
      error: requestStatusError,
    } = await supabase
      .from("direct_requests")
      .update({
        status: "accepted",
      })
      .eq("id", directRequestId)
      .neq("status", "accepted")
      .select("id")
      .maybeSingle();

    if (
      requestStatusError ||
      !acceptedRequest
    ) {
      console.error(
        "DIRECT REQUEST STATUS ERROR:",
        requestStatusError,
      );

      await supabase
        .from(
          "direct_request_offers",
        )
        .update({
          status: "sent",
        })
        .eq("id", offer.id)
        .eq("status", "accepted");

      await deleteCalendarEntry(
        createdCalendarEntry.id,
      );

      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön vahvistaminen epäonnistui.",
        },
        {
          status: requestStatusError
            ? 500
            : 409,
        },
      );
    }

    const {
      error: rejectError,
    } = await supabase
      .from(
        "direct_request_offers",
      )
      .update({
        status: "rejected",
      })
      .eq(
        "direct_request_id",
        directRequestId,
      )
      .neq("id", offer.id)
      .in("status", [
        "sent",
        "draft",
      ]);

    if (rejectError) {
      // Valinta on jo onnistunut. Mahdollinen
      // sulkemisvirhe kirjataan, mutta asiakkaalle
      // ei palauteta väärää epäonnistumisviestiä.
      console.error(
        "DIRECT OTHER OFFERS REJECT ERROR:",
        rejectError,
      );
    }
    let releasedCompetingSelections =
  0;

try {
  const releaseResult =
    await releaseCompetingQuoteSelections({
      partnerIds: [
        String(
          offer.partner_id,
        ),
      ],
      eventDate:
        directRequest.event_date,
    });

  releasedCompetingSelections =
    releaseResult.releasedSelections;

  if (
    releasedCompetingSelections >
    0
  ) {
    console.info(
      "COMPETING QUOTE SELECTIONS RELEASED AFTER DIRECT BOOKING:",
      {
        releasedSelections:
          releasedCompetingSelections,
        affectedQuoteIds:
          releaseResult.affectedQuoteIds,
      },
    );
  }
} catch (releaseError) {
  // Suora varaus on jo onnistunut.
  // Muiden alustavien valintojen
  // vapautusvirhe vain kirjataan.
  console.error(
    "COMPETING QUOTE SELECTION RELEASE ERROR:",
    releaseError,
  );
}

    const customerEmailSent =
      directRequest.email
        ? await sendEmail(
            createCustomerSelectionEmail({
              request: {
                ...directRequest,
                email:
                  directRequest.email,
              },
              offer,
              partner,
            }),
          )
        : false;

    const partnerEmailSent =
      partner.email
        ? await sendEmail(
            createPartnerSelectionEmail({
              request:
                directRequest,
              offer,
              partner: {
                ...partner,
                email:
                  partner.email,
              },
            }),
          )
        : false;

    return NextResponse.json({
  success: true,
  selectedOfferId:
    selectedOffer.id,
  customerEmailSent,
  partnerEmailSent,
  releasedCompetingSelections,
});
  } catch (error) {
    console.error(
      "DIRECT OFFER SELECTION ERROR:",
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