import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

const resend = new Resend(
  process.env.RESEND_API_KEY
);

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const directRequestId = String(
      body.directRequestId ?? ""
    ).trim();

    const offerId = String(body.offerId ?? "").trim();
    const accessToken = String(body.accessToken ?? "").trim();

    if (!directRequestId || !offerId || !accessToken) {
      return NextResponse.json(
        { error: "Valintatiedot puuttuvat." },
        { status: 400 }
      );
    }

    // Tarkista asiakkaan turvallinen linkki.
    const { data: directRequest, error: requestError } =
      await supabase
        .from("direct_requests")
        .select(`
  id,
  email,
  event_date,
  location,
  guests,
  event_type
`)
.eq("id", directRequestId)
.eq("access_token", accessToken)
.maybeSingle();

    if (requestError) {
      console.error(
        "DIRECT OFFER SELECTION REQUEST ERROR:",
        requestError
      );

      return NextResponse.json(
        { error: "Tarjouspyynnön tarkistaminen epäonnistui." },
        { status: 500 }
      );
    }

    if (!directRequest) {
      return NextResponse.json(
        { error: "Linkki ei ole voimassa." },
        { status: 403 }
      );
    }

    // Tarkista, ettei asiakkaalla ole jo hyväksyttyä tarjousta.
    const { data: acceptedOffer, error: acceptedError } =
      await supabase
        .from("direct_request_offers")
        .select("id")
        .eq("direct_request_id", directRequestId)
        .eq("status", "accepted")
        .maybeSingle();

    if (acceptedError) {
      console.error(
        "DIRECT ACCEPTED OFFER CHECK ERROR:",
        acceptedError
      );

      return NextResponse.json(
        { error: "Aikaisempaa valintaa ei voitu tarkistaa." },
        { status: 500 }
      );
    }

    if (acceptedOffer) {
      return NextResponse.json(
        { error: "Tarjous on jo valittu tähän pyyntöön." },
        { status: 409 }
      );
    }

    // Tarkista valittu tarjous.
    const { data: offer, error: offerError } = await supabase
      .from("direct_request_offers")
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
      .eq("direct_request_id", directRequestId)
      .maybeSingle();

    if (offerError) {
      console.error(
        "DIRECT OFFER SELECTION OFFER ERROR:",
        offerError
      );

      return NextResponse.json(
        { error: "Tarjouksen tarkistaminen epäonnistui." },
        { status: 500 }
      );
    }

    if (!offer) {
      return NextResponse.json(
        { error: "Tarjousta ei löytynyt." },
        { status: 404 }
      );
    }

    if (offer.status !== "sent") {
      return NextResponse.json(
        { error: "Tätä tarjousta ei voi enää valita." },
        { status: 409 }
      );
    }

    if (!Number.isFinite(Number(offer.price)) || Number(offer.price) <= 0) {
      return NextResponse.json(
        { error: "Tarjouksen hinta ei ole kelvollinen." },
        { status: 400 }
      );
    }

    const expiresAt = new Date(offer.expires_at);

    if (
      Number.isNaN(expiresAt.getTime()) ||
      expiresAt.getTime() < Date.now()
    ) {
      return NextResponse.json(
        { error: "Tarjous on vanhentunut." },
        { status: 409 }
      );
    }
const { data: partner, error: partnerError } =
  await supabase
    .from("partners")
    .select("id, company, email")
    .eq("id", offer.partner_id)
    .maybeSingle();

if (partnerError || !partner) {
  console.error(
    "DIRECT SELECTED PARTNER ERROR:",
    partnerError
  );

  return NextResponse.json(
    {
      error:
        "Valitun palveluntarjoajan tietoja ei löytynyt.",
    },
    { status: 500 }
  );
}
if (!directRequest.event_date) {
  return NextResponse.json(
    {
      error:
        "Tarjouspyynnöltä puuttuu tapahtuman päivämäärä.",
    },
    { status: 400 },
  );
}

const {
  data: existingCalendarEntry,
  error: calendarCheckError,
} = await supabase
  .from("partner_calendar_entries")
  .select("id, status")
  .eq("partner_id", offer.partner_id)
  .eq("date", directRequest.event_date)
  .maybeSingle();

if (calendarCheckError) {
  console.error(
    "DIRECT SELECTION CALENDAR CHECK ERROR:",
    calendarCheckError,
  );

  return NextResponse.json(
    {
      error:
        "Palveluntarjoajan saatavuutta ei voitu tarkistaa.",
    },
    { status: 500 },
  );
}

if (existingCalendarEntry) {
  return NextResponse.json(
    {
      error:
        "Palveluntarjoaja ei ole enää saatavilla tapahtuman päivänä. Valitse toinen tarjous.",
    },
    { status: 409 },
  );
}

const {
  data: createdCalendarEntry,
  error: calendarInsertError,
} = await supabase
  .from("partner_calendar_entries")
  .insert({
    partner_id: offer.partner_id,
    date: directRequest.event_date,
    status: "booked",
    note: `OmatJuhlat-varaus – ${
  directRequest.event_type || "Tapahtuma"
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
    "DIRECT SELECTION CALENDAR INSERT ERROR:",
    calendarInsertError,
  );

  const conflict =
    calendarInsertError?.code === "23505";

  return NextResponse.json(
    {
      error: conflict
        ? "Palveluntarjoaja ehti juuri varautua tapahtuman päivälle. Valitse toinen tarjous."
        : "Varauksen lisääminen kalenteriin epäonnistui.",
    },
    {
      status: conflict ? 409 : 500,
    },
  );
}
    // Hyväksy valittu tarjous.
    const { error: selectError } = await supabase
      .from("direct_request_offers")
      .update({
        status: "accepted",
      })
      .eq("id", offer.id)
      .eq("status", "sent");

    if (selectError) {
      console.error(
        "DIRECT OFFER SELECTION UPDATE ERROR:",
        selectError
      );
await supabase
  .from("partner_calendar_entries")
  .delete()
  .eq("id", createdCalendarEntry.id);
      return NextResponse.json(
        { error: "Tarjouksen valitseminen epäonnistui." },
        { status: 500 }
      );
    }

    // Hylkää muut saman suoran tarjouspyynnön tarjoukset.
    const { error: rejectError } = await supabase
      .from("direct_request_offers")
      .update({
        status: "rejected",
      })
      .eq("direct_request_id", directRequestId)
      .neq("id", offer.id)
      .in("status", ["sent", "draft"]);

   if (rejectError) {
  console.error(
    "DIRECT OTHER OFFERS REJECT ERROR:",
    rejectError,
  );

  return NextResponse.json(
    {
      error:
        "Tarjous valittiin, mutta muiden tarjousten sulkeminen epäonnistui.",
    },
    { status: 500 },
  );
}

// Merkitään koko suora tarjouspyyntö hyväksytyksi.
const { error: requestStatusError } =
  await supabase
    .from("direct_requests")
    .update({
      status: "accepted",
    })
    .eq("id", directRequestId);

if (requestStatusError) {
  console.error(
    "DIRECT REQUEST STATUS UPDATE ERROR:",
    requestStatusError,
  );
}

let customerEmailSent = false;
let partnerEmailSent = false;

if (directRequest.email) {
  const { error: customerEmailError } =
    await resend.emails.send({
      from: "OmatJuhlat <onboarding@resend.dev>",
      to: directRequest.email,
      subject:
        "Palveluntarjoajan valinta vahvistettu – OmatJuhlat",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Valintasi on vahvistettu 🎉</h2>

          <p>
            Olet valinnut palveluntarjoajan
            <strong>${escapeHtml(
              partner.company
            )}</strong>.
          </p>

          <p>
            <strong>Tapahtuma:</strong>
            ${escapeHtml(
              directRequest.event_type
            )}
          </p>

          <p>
            <strong>Päivämäärä:</strong>
            ${escapeHtml(
              directRequest.event_date
            )}
          </p>

          <p>
            <strong>Sijainti:</strong>
            ${escapeHtml(
              directRequest.location
            )}
          </p>

          <p>
            <strong>Vierasmäärä:</strong>
            ${escapeHtml(
              directRequest.guests
            )}
          </p>

          <p>
            <strong>Valittu hinta:</strong>
            ${escapeHtml(offer.price)} €
          </p>

          ${
            offer.message
              ? `
                <p>
                  <strong>Palveluntarjoajan viesti:</strong><br>
                  ${escapeHtml(offer.message)}
                </p>
              `
              : ""
          }

          <p>
            Palveluntarjoaja saa yhteystietosi ja
            ottaa sinuun yhteyttä yksityiskohtien sopimiseksi.
          </p>

          <p>
            Sopimus ja maksaminen hoidetaan suoraan
            palveluntarjoajan kanssa.
          </p>
        </div>
      `,
    });

  customerEmailSent = !customerEmailError;

  if (customerEmailError) {
    console.error(
      "DIRECT CUSTOMER SELECTION EMAIL ERROR:",
      customerEmailError
    );
  }
}

if (partner.email) {
  const { error: partnerEmailError } =
    await resend.emails.send({
      from: "OmatJuhlat <onboarding@resend.dev>",
      to: partner.email,
      subject:
        "Asiakas valitsi tarjouksesi – OmatJuhlat",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Onneksi olkoon! 🎉</h2>

          <p>Asiakas valitsi tarjouksesi.</p>

          <p>
            <strong>Hinta:</strong>
            ${escapeHtml(offer.price)} €
          </p>

          <p>
            <strong>Tapahtuma:</strong>
            ${escapeHtml(
              directRequest.event_type
            )}
          </p>

          <p>
            <strong>Päivämäärä:</strong>
            ${escapeHtml(
              directRequest.event_date
            )}
          </p>

          <p>
            <strong>Sijainti:</strong>
            ${escapeHtml(
              directRequest.location
            )}
          </p>

          <p>
            <strong>Vierasmäärä:</strong>
            ${escapeHtml(
              directRequest.guests
            )}
          </p>

          <h3>Asiakkaan yhteystiedot</h3>

          <p>
            <strong>Sähköposti:</strong>
            ${escapeHtml(
              directRequest.email
            )}
          </p>

          <p>
            Ota yhteyttä asiakkaaseen mahdollisimman pian.
          </p>
        </div>
      `,
    });

  partnerEmailSent = !partnerEmailError;

  if (partnerEmailError) {
    console.error(
      "DIRECT PARTNER SELECTION EMAIL ERROR:",
      partnerEmailError
    );
  }
}
    return NextResponse.json({
  success: true,
  selectedOfferId: offer.id,
  customerEmailSent,
  partnerEmailSent,
});
  } catch (error) {
    console.error(
      "DIRECT OFFER SELECTION API ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Palvelimella tapahtui odottamaton virhe." },
      { status: 500 }
    );
  }
}