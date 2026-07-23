import { randomUUID } from "crypto";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

import {
  isEventType,
} from "@/lib/events";

import {
  FINNISH_LOCATIONS,
} from "@/lib/locations";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const resendApiKey =
  process.env.RESEND_API_KEY;

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

const resend = resendApiKey
  ? new Resend(resendApiKey)
  : null;

type ValidPartner = {
  id: string;
  company: string | null;
};

function isValidEmail(
  email: string,
): boolean {
  return (
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    )
  );
}

function isValidLocation(
  location: string,
): boolean {
  return (
    FINNISH_LOCATIONS as readonly string[]
  ).includes(location);
}

function isValidUuid(
  value: string,
): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isCanonicalDate(
  value: string,
): boolean {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  ) {
    return false;
  }

  const [
    year,
    month,
    day,
  ] = value
    .split("-")
    .map(Number);

  const parsedDate = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  );

  return (
    parsedDate.getUTCFullYear() ===
      year &&
    parsedDate.getUTCMonth() ===
      month - 1 &&
    parsedDate.getUTCDate() === day
  );
}

function getMinimumEventDate(): string {
  const formatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Europe/Helsinki",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    );

  const parts =
    formatter.formatToParts(
      new Date(),
    );

  const year = Number(
    parts.find(
      (part) =>
        part.type === "year",
    )?.value,
  );

  const month = Number(
    parts.find(
      (part) =>
        part.type === "month",
    )?.value,
  );

  const day = Number(
    parts.find(
      (part) =>
        part.type === "day",
    )?.value,
  );

  const minimumDate = new Date(
    Date.UTC(
      year,
      month - 1,
      day + 3,
    ),
  );

  return minimumDate
    .toISOString()
    .slice(0, 10);
}

function escapeHtml(
  value: unknown,
): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll(
      "'",
      "&#039;",
    );
}

function getSiteUrl(
  request: Request,
): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL
      ?.trim()
      .replace(/\/+$/, "");

  return (
    configuredUrl ||
    new URL(request.url).origin
  );
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
            "Lähetetty tieto ei ole kelvollisessa muodossa.",
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
            "Tarjouspyynnön tiedot puuttuvat.",
        },
        {
          status: 400,
        },
      );
    }

    const requestBody =
      body as Record<string, unknown>;

    const email = String(
      requestBody.email ?? "",
    )
      .trim()
      .toLowerCase();

    const eventDate = String(
      requestBody.event_date ?? "",
    ).trim();

    const location = String(
      requestBody.location ?? "",
    ).trim();

    const eventType = String(
      requestBody.event_type ?? "",
    ).trim();

    const notes = String(
      requestBody.notes ?? "",
    ).trim();

    const guests = Number(
      requestBody.guests,
    );

    const partnerIds =
      Array.isArray(
        requestBody.partner_ids,
      )
        ? Array.from(
            new Set(
              requestBody.partner_ids
                .filter(
                  (
                    id,
                  ): id is string =>
                    typeof id ===
                    "string",
                )
                .map((id) =>
                  id.trim(),
                )
                .filter(Boolean),
            ),
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
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error:
            "Anna kelvollinen sähköpostiosoite.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isEventType(eventType)) {
      return NextResponse.json(
        {
          error:
            "Valitse kelvollinen tapahtumatyyppi.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidLocation(location)) {
      return NextResponse.json(
        {
          error:
            "Valitse kelvollinen paikkakunta.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      guests < 1 ||
      guests > 10000
    ) {
      return NextResponse.json(
        {
          error:
            "Vierasmäärän täytyy olla 1–10 000.",
        },
        {
          status: 400,
        },
      );
    }

    if (notes.length > 2000) {
      return NextResponse.json(
        {
          error:
            "Lisätiedot voivat olla enintään 2 000 merkkiä.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isCanonicalDate(eventDate)
    ) {
      return NextResponse.json(
        {
          error:
            "Päivämäärä ei ole kelvollinen.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      eventDate <
      getMinimumEventDate()
    ) {
      return NextResponse.json(
        {
          error:
            "Valitse päivä vähintään kolmen päivän päähän.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      partnerIds.some(
        (partnerId) =>
          !isValidUuid(partnerId),
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Yksi tai useampi valittu yritys ei ole kelvollinen.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: partnerData,
      error: partnersError,
    } = await supabase
      .from("partners")
      .select("id, company")
      .in("id", partnerIds)
      .eq("status", "approved")
      .eq(
        "profile_completed",
        true,
      );

    if (partnersError) {
      console.error(
        "DIRECT REQUEST PARTNER ERROR:",
        partnersError,
      );

      return NextResponse.json(
        {
          error:
            "Valittuja yrityksiä ei voitu tarkistaa.",
        },
        {
          status: 500,
        },
      );
    }

    const validPartners =
      (partnerData ??
        []) as ValidPartner[];

    const validPartnerIds =
      validPartners.map(
        (partner) =>
          String(partner.id),
      );

    const validPartnerIdSet =
      new Set(validPartnerIds);

    const everyPartnerIsValid =
      validPartnerIds.length ===
        partnerIds.length &&
      partnerIds.every(
        (partnerId) =>
          validPartnerIdSet.has(
            partnerId,
          ),
      );

    if (!everyPartnerIsValid) {
      return NextResponse.json(
        {
          error:
            "Yksi tai useampi valittu yritys ei ole enää saatavilla.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: calendarEntries,
      error: calendarError,
    } = await supabase
      .from(
        "partner_calendar_entries",
      )
      .select("partner_id")
      .eq("date", eventDate)
      .in(
        "partner_id",
        validPartnerIds,
      )
      .in("status", [
        "unavailable",
        "booked",
      ]);

    if (calendarError) {
      console.error(
        "DIRECT REQUEST CALENDAR ERROR:",
        calendarError,
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
      calendarEntries &&
      calendarEntries.length > 0
    ) {
      const unavailableIds =
        new Set(
          calendarEntries.map(
            (entry) =>
              String(
                entry.partner_id,
              ),
          ),
        );

      const unavailableCompanies =
        validPartners
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

      return NextResponse.json(
        {
          error:
            unavailableCompanies.length ===
            1
              ? `${unavailableCompanies[0]} ei ole saatavilla valittuna päivänä. Valitse toinen päivä tai palveluntarjoaja.`
              : `Seuraavat yritykset eivät ole saatavilla valittuna päivänä: ${unavailableCompanies.join(", ")}. Valitse toinen päivä tai poista nämä yritykset valinnasta.`,
        },
        {
          status: 409,
        },
      );
    }

    const accessToken =
      randomUUID();

    const {
      data: createdRequest,
      error: insertError,
    } = await supabase
      .from("direct_requests")
      .insert({
        email,
        event_date: eventDate,
        guests,
        location,
        event_type: eventType,
        partner_ids:
          validPartnerIds,
        notes: notes || null,
        status: "new",
        access_token: accessToken,
      })
      .select("id, access_token")
      .single();

    if (
      insertError ||
      !createdRequest
    ) {
      console.error(
        "DIRECT REQUEST INSERT ERROR:",
        insertError,
      );

      return NextResponse.json(
        {
          error:
            "Tarjouspyynnön tallentaminen epäonnistui.",
        },
        {
          status: 500,
        },
      );
    }

    const siteUrl =
      getSiteUrl(request);

    const customerUrl =
      `${siteUrl}/direct-request/${createdRequest.id}` +
      `?token=${encodeURIComponent(accessToken)}`;

    const partnerNames =
      validPartners
        .map(
          (partner) =>
            partner.company ||
            "Palveluntarjoaja",
        )
        .join(", ");

    let notificationEmailSent =
      false;

    let customerEmailSent =
      false;

    if (resend) {
      const adminEmail =
        process.env
          .ADMIN_NOTIFICATION_EMAIL ||
        "jvanosan2003@gmail.com";

      try {
        const {
          error: adminEmailError,
        } =
          await resend.emails.send({
            from:
              "OmatJuhlat <onboarding@resend.dev>",
            to: adminEmail,
            subject:
              "Uusi suora tarjouspyyntö",
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.7;">
                <h2>Uusi suora tarjouspyyntö</h2>

                <p><strong>Asiakas:</strong> ${escapeHtml(email)}</p>
                <p><strong>Tapahtuma:</strong> ${escapeHtml(eventType)}</p>
                <p><strong>Paikkakunta:</strong> ${escapeHtml(location)}</p>
                <p><strong>Päivämäärä:</strong> ${escapeHtml(eventDate)}</p>
                <p><strong>Vierasmäärä:</strong> ${guests}</p>
                <p><strong>Valitut yritykset:</strong> ${escapeHtml(partnerNames)}</p>

                ${
                  notes
                    ? `<p><strong>Lisätiedot:</strong><br>${escapeHtml(notes)}</p>`
                    : ""
                }
              </div>
            `,
          });

        if (adminEmailError) {
          console.error(
            "DIRECT REQUEST ADMIN EMAIL ERROR:",
            adminEmailError,
          );
        } else {
          notificationEmailSent =
            true;
        }
      } catch (emailError) {
        console.error(
          "DIRECT REQUEST ADMIN EMAIL ERROR:",
          emailError,
        );
      }

      try {
        const {
          error: customerEmailError,
        } =
          await resend.emails.send({
            from:
              "OmatJuhlat <onboarding@resend.dev>",
            to: email,
            subject:
              "Tarjouspyyntösi on vastaanotettu – OmatJuhlat",
            html: `
              <div style="margin:0;background:#fbf8f2;padding:32px 16px;font-family:Arial,sans-serif;color:#211b16;">
                <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8ded0;border-radius:20px;padding:32px;">
                  <p style="margin:0 0 8px;color:#9a773b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                    OmatJuhlat
                  </p>

                  <h1 style="margin:0 0 20px;font-size:26px;">
                    Tarjouspyyntösi on vastaanotettu
                  </h1>

                  <p style="line-height:1.7;color:#62584f;">
                    Pyyntösi välitettiin valitsemillesi palveluntarjoajille. Saat tarjoukset turvalliselle tarjouspyyntösivullesi.
                  </p>

                  <p><strong>Tapahtuma:</strong> ${escapeHtml(eventType)}</p>
                  <p><strong>Paikkakunta:</strong> ${escapeHtml(location)}</p>
                  <p><strong>Päivämäärä:</strong> ${escapeHtml(eventDate)}</p>
                  <p><strong>Vierasmäärä:</strong> ${guests}</p>

                  <p style="margin:28px 0;">
                    <a
                      href="${escapeHtml(customerUrl)}"
                      style="display:inline-block;padding:14px 22px;border-radius:12px;background:#b48a45;color:#ffffff;font-weight:700;text-decoration:none;"
                    >
                      Avaa tarjouspyyntösi
                    </a>
                  </p>

                  <p style="color:#91877d;font-size:13px;line-height:1.6;">
                    Säilytä tämä sähköposti. Linkki on henkilökohtainen, eikä sitä pidä jakaa muille.
                  </p>

                  <p style="color:#91877d;font-size:13px;line-height:1.6;">
                    Tarjouspyyntö ei sido sinua hyväksymään tarjousta.
                  </p>
                </div>
              </div>
            `,
          });

        if (customerEmailError) {
          console.error(
            "DIRECT REQUEST CUSTOMER EMAIL ERROR:",
            customerEmailError,
          );
        } else {
          customerEmailSent =
            true;
        }
      } catch (emailError) {
        console.error(
          "DIRECT REQUEST CUSTOMER EMAIL ERROR:",
          emailError,
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        requestId:
          createdRequest.id,
        accessToken:
          createdRequest.access_token ??
          accessToken,
        notificationEmailSent,
        customerEmailSent,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "DIRECT REQUEST API ERROR:",
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