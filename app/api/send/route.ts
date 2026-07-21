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

async function sendEmail(payload: EmailPayload) {
  const { error } = await resend.emails.send(payload);

  if (error) {
    console.error("RESEND EMAIL ERROR:", error);
    throw new Error(error.message);
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
// TÄHÄN

const { error: statusUpdateError } = await supabase
  .from("request_quotes")
  .update({
    status: "confirmed",
  })
  .eq("id", quoteId)
  .eq("access_token", accessToken);

if (statusUpdateError) {
  console.error(
    "QUOTE CONFIRMATION STATUS ERROR:",
    statusUpdateError,
  );

  return Response.json(
    { error: "Vahvistuksen tilan tallentaminen epäonnistui." },
    { status: 500 },
  );
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