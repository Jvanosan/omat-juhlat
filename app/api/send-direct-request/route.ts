import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

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

const ALLOWED_EVENT_TYPES = [
  "Häät",
  "Syntymäpäivä",
  "Valmistujaiset",
  "Yritysjuhla",
  "Ristiäiset",
  "Muu juhla",
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const eventDate = String(body.event_date ?? "").trim();
    const location = String(body.location ?? "").trim();
    const eventType = String(body.event_type ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const guests = Number(body.guests);

    const partnerIds = Array.isArray(body.partner_ids)
      ? Array.from(
          new Set(
            body.partner_ids
              .map((id: unknown) => String(id).trim())
              .filter(Boolean)
          )
        )
      : [];

    if (
      !email ||
      !eventDate ||
      !location ||
      !eventType ||
      !Number.isInteger(guests) ||
      partnerIds.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Täytä sähköposti, tapahtumatyyppi, sijainti, päivämäärä ja vierasmäärä sekä valitse vähintään yksi yritys.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Anna kelvollinen sähköpostiosoite." },
        { status: 400 }
      );
    }

    if (!ALLOWED_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: "Tapahtumatyyppi ei ole kelvollinen." },
        { status: 400 }
      );
    }

    if (location.length > 100) {
      return NextResponse.json(
        { error: "Sijainti on liian pitkä." },
        { status: 400 }
      );
    }

    if (guests < 1 || guests > 5000) {
      return NextResponse.json(
        { error: "Vierasmäärän täytyy olla 1–5000." },
        { status: 400 }
      );
    }

    if (notes.length > 1000) {
      return NextResponse.json(
        { error: "Lisätiedot voivat olla enintään 1000 merkkiä." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      return NextResponse.json(
        { error: "Päivämäärä ei ole kelvollinen." },
        { status: 400 }
      );
    }

    const selectedDate = new Date(`${eventDate}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Päivämäärä ei ole kelvollinen." },
        { status: 400 }
      );
    }

    const earliestDate = new Date();
    earliestDate.setHours(0, 0, 0, 0);
    earliestDate.setDate(earliestDate.getDate() + 3);

    if (selectedDate < earliestDate) {
      return NextResponse.json(
        { error: "Valitse päivä vähintään kolmen päivän päähän." },
        { status: 400 }
      );
    }

    // Tarkistetaan, että valitut yritykset ovat hyväksyttyjä.
    const { data: validPartners, error: partnersError } =
      await supabase
        .from("partners")
        .select("id, company")
        .in("id", partnerIds)
        .eq("status", "approved")
        .eq("profile_completed", true);

    if (partnersError) {
      console.error("DIRECT REQUEST PARTNER ERROR:", partnersError);

      return NextResponse.json(
        { error: "Valittuja yrityksiä ei voitu tarkistaa." },
        { status: 500 }
      );
    }

    const validPartnerIds = (validPartners ?? []).map((partner) =>
      String(partner.id)
    );

    if (
      validPartnerIds.length === 0 ||
      validPartnerIds.length !== partnerIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "Yksi tai useampi valittu yritys ei ole enää saatavilla.",
        },
        { status: 400 }
      );
    }

    // Tallennus tapahtuu palvelimella service role -avaimella.
    const { data: createdRequest, error: insertError } =
      await supabase
        .from("direct_requests")
        .insert({
          email,
          event_date: eventDate,
          guests,
          location,
          event_type: eventType,
          partner_ids: validPartnerIds,
          notes: notes || null,
          status: "new",
        })
        .select("id, access_token")
.single();

    if (insertError || !createdRequest) {
      console.error("DIRECT REQUEST INSERT ERROR:", insertError);

      return NextResponse.json(
        { error: "Tarjouspyynnön tallentaminen epäonnistui." },
        { status: 500 }
      );
    }

    const partnerNames = (validPartners ?? [])
      .map((partner) => escapeHtml(partner.company || "Palveluntarjoaja"))
      .join(", ");
  
    const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  new URL(req.url).origin;

const customerUrl =
  `${siteUrl}/direct-request/${createdRequest.id}` +
  `?token=${encodeURIComponent(createdRequest.access_token)}`;

    const { error: emailError } = await resend.emails.send({
      from: "OmatJuhlat <onboarding@resend.dev>",
      to: ["jvanosan2003@gmail.com"],
      subject: "Uusi suora tarjouspyyntö",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Uusi suora tarjouspyyntö</h2>

          <p><strong>Sähköposti:</strong> ${escapeHtml(email)}</p>
          <p><strong>Tapahtuma:</strong> ${escapeHtml(eventType)}</p>
          <p><strong>Sijainti:</strong> ${escapeHtml(location)}</p>
          <p><strong>Päivämäärä:</strong> ${escapeHtml(eventDate)}</p>
          <p><strong>Vierasmäärä:</strong> ${guests}</p>
          <p><strong>Valitut yritykset:</strong> ${partnerNames}</p>

          ${
            notes
              ? `<p><strong>Lisätiedot:</strong><br>${escapeHtml(notes)}</p>`
              : ""
          }
        </div>
      `,
    });

    if (emailError) {
      console.error("DIRECT REQUEST EMAIL ERROR:", emailError);
    }
    const { error: customerEmailError } = await resend.emails.send({
  from: "OmatJuhlat <onboarding@resend.dev>",
  to: email,
  subject: "Tarjouspyyntösi on vastaanotettu – OmatJuhlat",
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Tarjouspyyntösi on vastaanotettu ✅</h2>

      <p>
        Pyyntösi lähetettiin valitsemillesi palveluntarjoajille.
        Saat tarjoukset omalle turvalliselle sivullesi.
      </p>

      <p><strong>Tapahtuma:</strong> ${escapeHtml(eventType)}</p>
      <p><strong>Sijainti:</strong> ${escapeHtml(location)}</p>
      <p><strong>Päivämäärä:</strong> ${escapeHtml(eventDate)}</p>
      <p><strong>Vierasmäärä:</strong> ${guests}</p>

      <p style="margin: 24px 0;">
        <a
          href="${escapeHtml(customerUrl)}"
          style="
            display: inline-block;
            padding: 14px 20px;
            border-radius: 10px;
            background: #059669;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
          "
        >
          Avaa tarjouspyyntösi
        </a>
      </p>

      <p>
        Säilytä tämä sähköposti. Linkki on henkilökohtainen,
        eikä sitä pidä jakaa muille.
      </p>

      <p>
        Tarjouspyyntö ei sido sinua hyväksymään tarjousta.
      </p>
    </div>
  `,
});

if (customerEmailError) {
  console.error(
    "DIRECT REQUEST CUSTOMER EMAIL ERROR:",
    customerEmailError
  );
}

    return NextResponse.json(
  {
    success: true,
    requestId: createdRequest.id,
    accessToken: createdRequest.access_token,
    notificationEmailSent: !emailError,
    customerEmailSent: !customerEmailError,
  },
  { status: 201 }
);
  } catch (error) {
    console.error("DIRECT REQUEST API ERROR:", error);

    return NextResponse.json(
      { error: "Palvelimella tapahtui odottamaton virhe." },
      { status: 500 }
    );
  }
}