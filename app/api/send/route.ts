import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// LISÄÄ TÄMÄ

type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(
  payload: EmailPayload,
) {
  try {
    const { error } =
      await resend.emails.send(payload);

    if (error) {
      console.error(
        "RESEND EMAIL ERROR:",
        error,
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "RESEND EMAIL ERROR:",
      error,
    );

    return false;
  }
}
// TÄHÄN

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const quoteId = Number(body.quoteId);
    const accessToken = String(body.accessToken ?? "").trim();

    if (
      !Number.isInteger(quoteId) ||
      quoteId < 1 ||
      !accessToken
    ) {
      return Response.json(
        { error: "Tarjouspyynnön tunniste puuttuu tai on virheellinen." },
        { status: 400 },
      );
    }

    // Tarkista, että ID ja turvallinen token kuuluvat yhteen
    const { data: quote, error: quoteError } = await supabase
      .from("request_quotes")
      .select("*")
      .eq("id", quoteId)
      .eq("access_token", accessToken)
      .maybeSingle();

    if (quoteError) {
      console.error("QUOTE ACCESS CHECK ERROR:", quoteError);

      return Response.json(
        { error: "Tarjouspyynnön tarkistaminen epäonnistui." },
        { status: 500 },
      );
    }

    if (!quote) {
      return Response.json(
        { error: "Linkki ei ole voimassa." },
        { status: 403 },
      );
    }
    // LISÄÄ TÄMÄ

if (quote.status === "confirmed") {
  return Response.json(
    {
      error: "Tarjouspyyntö on jo vahvistettu.",
      alreadyConfirmed: true,
    },
    { status: 409 },
  );
}

    // kaikki tarjoukset
    const { data: offers } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("quote_id", quoteId);

    // partnerit
    const { data: partners } = await supabase
      .from("partners")
      .select("*");

    if (!offers || !partners) {
      return Response.json({ ok: true });
    }

    // VOITTAJAT
  const winners = offers.filter(
  (o) =>
    o.status === "selected" ||
    o.status === "valittu"
);
// LISÄÄ TÄMÄ

if (winners.length === 0) {
  return Response.json(
    { error: "Yhtään palveluntarjoajaa ei ole valittu." },
    { status: 400 },
  );
}
if (!quote.date) {
  return Response.json(
    {
      error:
        "Tarjouspyynnöltä puuttuu tapahtuman päivämäärä.",
    },
    { status: 400 },
  );
}

// Sama partneri voi voittaa useamman palvelun,
// mutta kalenteriin tehdään vain yksi päivämerkintä.
const winnerPartnerIds = Array.from(
  new Set(
    winners
      .map((winner) =>
        String(winner.partner_id ?? ""),
      )
      .filter(Boolean),
  ),
);

const {
  data: existingCalendarEntries,
  error: calendarCheckError,
} = await supabase
  .from("partner_calendar_entries")
  .select("partner_id, status")
  .eq("date", quote.date)
  .in("partner_id", winnerPartnerIds);

if (calendarCheckError) {
  console.error(
    "QUOTE CALENDAR CHECK ERROR:",
    calendarCheckError,
  );

  return Response.json(
    {
      error:
        "Palveluntarjoajien saatavuutta ei voitu tarkistaa.",
    },
    { status: 500 },
  );
}

if (
  existingCalendarEntries &&
  existingCalendarEntries.length > 0
) {
  const unavailableIds = new Set(
    existingCalendarEntries.map((entry) =>
      String(entry.partner_id),
    ),
  );

  const unavailableCompanies = partners
    .filter((partner) =>
      unavailableIds.has(
        String(partner.id),
      ),
    )
    .map(
      (partner) =>
        partner.company ||
        "Palveluntarjoaja",
    );

  return Response.json(
    {
      error:
        unavailableCompanies.length === 1
          ? `${unavailableCompanies[0]} ei ole enää saatavilla tapahtuman päivänä.`
          : `Seuraavat palveluntarjoajat eivät ole enää saatavilla tapahtuman päivänä: ${unavailableCompanies.join(
              ", ",
            )}.`,
    },
    { status: 409 },
  );
}

const {
  data: createdCalendarEntries,
  error: calendarInsertError,
} = await supabase
  .from("partner_calendar_entries")
  .insert(
    winnerPartnerIds.map((partnerId) => ({
      partner_id: partnerId,
      date: quote.date,
      status: "booked",
      note: `OmatJuhlat-varaus – ${
  quote.event_type || "Tapahtuma"
}${
  quote.location
    ? `, ${quote.location}`
    : ""
}`,
    })),
  )
  .select("id");

if (calendarInsertError) {
  console.error(
    "QUOTE CALENDAR INSERT ERROR:",
    calendarInsertError,
  );

  const conflict =
    calendarInsertError.code === "23505";

  return Response.json(
    {
      error: conflict
        ? "Yksi palveluntarjoajista ehti juuri varautua tapahtuman päivälle."
        : "Varauksen lisääminen kalenteriin epäonnistui.",
    },
    {
      status: conflict ? 409 : 500,
    },
  );
}
const { error: statusUpdateError } =
  await supabase
    .from("request_quotes")
    .update({
      status: "confirmed",
    })
    .eq("id", quoteId)
    .eq("access_token", accessToken)
    .neq("status", "confirmed");

if (statusUpdateError) {
  console.error(
    "QUOTE CONFIRMATION STATUS ERROR:",
    statusUpdateError,
  );

  const createdEntryIds = (
    createdCalendarEntries ?? []
  ).map((entry) => entry.id);

  // Jos vahvistus epäonnistui, palautetaan tämän
  // pyynnön juuri luomat kalenterimerkinnät.
  if (createdEntryIds.length > 0) {
    const { error: rollbackError } =
      await supabase
        .from("partner_calendar_entries")
        .delete()
        .in("id", createdEntryIds);

    if (rollbackError) {
      console.error(
        "QUOTE CALENDAR ROLLBACK ERROR:",
        rollbackError,
      );
    }
  }

  return Response.json(
    {
      error:
        "Vahvistuksen tilan tallentaminen epäonnistui.",
    },
    { status: 500 },
  );
}
    // HÄVIÄJÄT
    const losers = offers.filter(
  (o) =>
    o.status === "rejected" ||
    o.status === "hävitty"
);
    // ✅ VOITTAJA-EMAIL
    for (const win of winners) {
      const partner = partners.find(
        (p) => p.id === win.partner_id
      );
      if (!partner) continue;

await sendEmail({
          from: "OmatJuhlat <noreply@omatjuhlat.fi>",
        to: partner.email,
        subject: "🎉 Voitit tarjouksen – OmatJuhlat",
        html: `
          <h2>Onneksi olkoon!</h2>
          <p>Asiakas valitsi tarjouksesi.</p>

          <p><strong>Palvelu:</strong> ${win.service}</p>
          <p><strong>Hinta:</strong> ${win.offer_price} €</p>

          <h3>Asiakkaan tiedot</h3>
          <p>${quote.name || ""}</p>
          <p>${quote.email}</p>
          <p>${quote.phone || ""}</p>

          <p>Ota yhteyttä asiakkaaseen mahdollisimman pian.</p>
        `,
      });
    }

    // ❌ HÄVIÄJÄ-EMAIL
    for (const lose of losers) {
      const partner = partners.find(
        (p) => p.id === lose.partner_id
      );
      if (!partner) continue;

await sendEmail({
  from: "OmatJuhlat <noreply@omatjuhlat.fi>",
        to: partner.email,
        subject: "Kiitos tarjouksesta – OmatJuhlat",
        html: `
          <h3>Kiitos tarjouksestasi</h3>
          <p>
            Tällä kertaa asiakas valitsi toisen palveluntarjoajan.
          </p>
          <p>
            Kiitos osallistumisesta – uusia tarjouspyyntöjä tulee pian!
          </p>
        `,
      });
    }
     // ✅ ASIAKAS-EMAIL (vahvistus)
if (winners.length > 0 && quote?.email) {
  const selected = winners[0];
  const partner = partners.find(
    (p) => p.id === selected.partner_id
  );

await sendEmail({
  from: "OmatJuhlat <noreply@omatjuhlat.fi>",    to: quote.email,
subject: "✅ Palveluntarjoajan valinta vahvistettu – OmatJuhlat",    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>🎉 Palveluntarjoajan valinta on vahvistettu</h2>

<p>
  Olet valinnut palveluntarjoajan tapahtumaasi.
  Alla on yhteenveto valinnastasi.
</p>

<p>
  Huomioithan, että varsinainen sopimus, maksaminen ja tapahtuman
  yksityiskohdat sovitaan suoraan palveluntarjoajan kanssa.
</p>

        <hr />

        <p><strong>📅 Päivämäärä:</strong> ${quote.date}</p>
        <p><strong>📍 Paikkakunta:</strong> ${quote.location}</p>
        <p><strong>👥 Vierasmäärä:</strong> ${quote.guests}</p>

        <p style="font-size: 18px; margin-top: 12px;">
          <strong>💰 Valittu hinta:</strong> ${selected.offer_price} €
        </p>

        ${
          selected.offer_message
            ? `<p><strong>💬 Palveluntarjoajan viesti:</strong><br />${selected.offer_message}</p>`
            : ""
        }

        <hr />

        <p>
          ✅ Olemme ilmoittaneet valitulle palveluntarjoajalle
          <strong>${partner?.company || ""}</strong>.
          Palveluntarjoaja on sinuun yhteydessä sopiakseen yksityiskohdista.
          </p>

        <p style="margin-top: 16px;">
          Kiitos kun käytit <strong>OmatJuhlat</strong>‑palvelua!
        </p>

        <p style="color: #666; font-size: 14px;">
          Jos sinulla on kysyttävää, vastaa tähän sähköpostiin.
        </p>
      </div>
    `,
  });
}
return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Email error" },
      { status: 500 }
    );
  }
}