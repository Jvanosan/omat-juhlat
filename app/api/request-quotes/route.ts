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

import {
  SERVICE_OPTIONS,
  type ServiceCategoryId,
} from "@/lib/services";

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

const ALLOWED_SERVICE_IDS =
  SERVICE_OPTIONS.map(
    (service) => service.id,
  );

const SERVICE_ALIASES =
  createServiceAliases();

type PartnerServiceOptions = {
  categories?: unknown;
  options?: unknown;
};

type PartnerRow = {
  id: string;
  company: string | null;
  email: string | null;
  category: string | null;
  service_options:
    | PartnerServiceOptions
    | null;
  area: string | null;
  min_guests: number | null;
  max_guests: number | null;
};

type QuotePartnerRow = {
  quote_id: string | number;
  partner_id: string;
  service: ServiceCategoryId;
  status: "sent";
};

function createServiceAliases() {
  const aliases =
    new Map<string, ServiceCategoryId>();

  for (const service of SERVICE_OPTIONS) {
    aliases.set(
      service.id.toLowerCase(),
      service.id,
    );

    aliases.set(
      service.label
        .trim()
        .toLowerCase(),
      service.id,
    );
  }

  // Väliaikainen yhteensopivuus vanhoille
  // saman palvelun tunnuksille.
  aliases.set("juhlatila", "venue");
  aliases.set("photographer", "photography");
  aliases.set("valokuvaaja", "photography");
  aliases.set("valokuvaus", "photography");
  aliases.set("decor", "decoration");
  aliases.set("somistus", "decoration");
  aliases.set("koristelu", "decoration");
  aliases.set("kuljetus", "transport");

  return aliases;
}

function normalizeService(
  value: unknown,
): ServiceCategoryId | null {
  const normalized = String(
    value ?? "",
  )
    .trim()
    .toLowerCase();

  return (
    SERVICE_ALIASES.get(normalized) ??
    null
  );
}

function parseRequestedServices(
  value: unknown,
): ServiceCategoryId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const services = value
    .filter(
      (service): service is string =>
        typeof service === "string",
    )
    .map(normalizeService)
    .filter(
      (
        service,
      ): service is ServiceCategoryId =>
        service !== null,
    );

  return Array.from(new Set(services));
}

function parsePartnerCategories(
  partner: PartnerRow,
): ServiceCategoryId[] {
  const rawCategories: unknown[] = [];

  const serviceOptions =
    partner.service_options;

  if (
    serviceOptions &&
    typeof serviceOptions === "object" &&
    Array.isArray(
      serviceOptions.categories,
    )
  ) {
    rawCategories.push(
      ...serviceOptions.categories,
    );
  }

  if (partner.category) {
    rawCategories.push(
      partner.category,
    );
  }

  return Array.from(
    new Set(
      rawCategories
        .map(normalizeService)
        .filter(
          (
            service,
          ): service is ServiceCategoryId =>
            service !== null,
        ),
    ),
  );
}

function parsePartnerAreas(
  value: unknown,
): string[] {
  if (!value) {
    return [];
  }

  return String(value)
    .split(/[,;]+/)
    .map((area) =>
      area.trim().toLocaleLowerCase(
        "fi",
      ),
    )
    .filter(Boolean);
}

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

    const date = String(
      requestBody.date ?? "",
    ).trim();

    const eventType = String(
      requestBody.eventType ?? "",
    ).trim();

    const location = String(
      requestBody.location ?? "",
    ).trim();

    const email = String(
      requestBody.email ?? "",
    )
      .trim()
      .toLowerCase();

    const notes = String(
      requestBody.notes ?? "",
    ).trim();

    const guests = Number(
      requestBody.guests,
    );

    const budget =
      requestBody.budget === "" ||
      requestBody.budget === null ||
      requestBody.budget ===
        undefined
        ? null
        : Number(
            requestBody.budget,
          );

    const services =
      parseRequestedServices(
        requestBody.services,
      );

    if (
      !date ||
      !eventType ||
      !location ||
      !email ||
      services.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Täytä päivämäärä, tapahtumatyyppi, paikkakunta, sähköposti ja valitse vähintään yksi palvelu.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isCanonicalDate(date)) {
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
      date < getMinimumEventDate()
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

    if (
      !Number.isInteger(guests) ||
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

    if (
      budget !== null &&
      (
        !Number.isFinite(budget) ||
        budget < 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Budjetin täytyy olla 0 tai sitä suurempi.",
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
      services.some(
        (service) =>
          !ALLOWED_SERVICE_IDS.includes(
            service,
          ),
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Valitse vain listassa olevia palveluita.",
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
      .select(`
        id,
        company,
        email,
        category,
        service_options,
        area,
        min_guests,
        max_guests
      `)
      .eq("status", "approved")
      .eq(
        "profile_completed",
        true,
      );

    if (partnersError) {
      console.error(
        "REQUEST QUOTE PARTNERS ERROR:",
        partnersError,
      );

      return NextResponse.json(
        {
          error:
            "Palveluntarjoajien hakeminen epäonnistui.",
        },
        {
          status: 500,
        },
      );
    }

    const partners =
      (partnerData ??
        []) as PartnerRow[];

    const partnerIds =
      partners.map(
        (partner) => partner.id,
      );

    const unavailablePartnerIds =
      new Set<string>();

    if (partnerIds.length > 0) {
      const {
        data: calendarEntries,
        error: calendarError,
      } = await supabase
        .from(
          "partner_calendar_entries",
        )
        .select("partner_id")
        .eq("date", date)
        .in(
          "partner_id",
          partnerIds,
        )
        .in("status", [
          "unavailable",
          "booked",
        ]);

      if (calendarError) {
        console.error(
          "REQUEST QUOTE CALENDAR ERROR:",
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

      for (
        const entry of
        calendarEntries ?? []
      ) {
        unavailablePartnerIds.add(
          String(entry.partner_id),
        );
      }
    }

    const requestedLocation =
      location.toLocaleLowerCase(
        "fi",
      );

    const matchedAssignments: Array<{
      partnerId: string;
      service: ServiceCategoryId;
    }> = [];

    for (const partner of partners) {
      if (
        unavailablePartnerIds.has(
          partner.id,
        )
      ) {
        continue;
      }

      const partnerAreas =
        parsePartnerAreas(
          partner.area,
        );

      const areaMatches =
        partnerAreas.includes(
          requestedLocation,
        ) ||
        partnerAreas.includes(
          "suomi",
        ) ||
        partnerAreas.includes(
          "koko suomi",
        );

      const minimumGuests =
        partner.min_guests === null
          ? null
          : Number(
              partner.min_guests,
            );

      const maximumGuests =
        partner.max_guests === null
          ? null
          : Number(
              partner.max_guests,
            );

      const minimumCapacityMatches =
        minimumGuests === null ||
        !Number.isFinite(
          minimumGuests,
        ) ||
        guests >= minimumGuests;

      const maximumCapacityMatches =
        maximumGuests === null ||
        !Number.isFinite(
          maximumGuests,
        ) ||
        guests <= maximumGuests;

      if (
        !areaMatches ||
        !minimumCapacityMatches ||
        !maximumCapacityMatches
      ) {
        continue;
      }

      const partnerCategories =
        parsePartnerCategories(
          partner,
        );

      const matchedServices =
        services.filter(
          (service) =>
            partnerCategories.includes(
              service,
            ),
        );

      for (
        const service of
        matchedServices
      ) {
        matchedAssignments.push({
          partnerId: partner.id,
          service,
        });
      }
    }

    const accessToken =
      randomUUID();

    const {
      data: quote,
      error: quoteError,
    } = await supabase
      .from("request_quotes")
      .insert({
        date,
        event_type: eventType,
        location,
        guests,
        email,
        budget,
        services,
        status: "avoin",
        notes: notes || null,
        access_token: accessToken,
      })
      .select(
        "id, access_token",
      )
      .single();

    if (quoteError || !quote) {
      console.error(
        "REQUEST QUOTE INSERT ERROR:",
        quoteError,
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

    const quotePartnerRows:
      QuotePartnerRow[] =
      matchedAssignments.map(
        (assignment) => ({
          quote_id: quote.id,
          partner_id:
            assignment.partnerId,
          service:
            assignment.service,
          status: "sent",
        }),
      );

    if (
      quotePartnerRows.length > 0
    ) {
      const {
        error: assignmentsError,
      } = await supabase
        .from("quote_partners")
        .upsert(
          quotePartnerRows,
          {
            onConflict:
              "quote_id,partner_id,service",
            ignoreDuplicates: true,
          },
        );

      if (assignmentsError) {
        console.error(
          "QUOTE PARTNERS INSERT ERROR:",
          assignmentsError,
        );

        const {
          error: cleanupError,
        } = await supabase
          .from("request_quotes")
          .delete()
          .eq("id", quote.id);

        if (cleanupError) {
          console.error(
            "REQUEST QUOTE CLEANUP ERROR:",
            cleanupError,
          );
        }

        return NextResponse.json(
          {
            error:
              "Tarjouspyyntöä ei voitu yhdistää palveluntarjoajiin. Yritä uudelleen.",
          },
          {
            status: 500,
          },
        );
      }
    }

    const matchedPartnerCount =
      new Set(
        matchedAssignments.map(
          (assignment) =>
            assignment.partnerId,
        ),
      ).size;

    let confirmationEmailSent =
      false;

    if (resend) {
      try {
        const siteUrl =
          getSiteUrl(request);

        const quoteUrl =
          `${siteUrl}/quote/${quote.id}` +
          `?token=${encodeURIComponent(
            accessToken,
          )}`;

        const matchMessage =
          matchedPartnerCount > 0
            ? `Tarjouspyyntö lähetettiin ${matchedPartnerCount} sopivalle palveluntarjoajalle. Saat ilmoituksen, kun tarjouksia saapuu.`
            : "Tarjouspyyntö tallennettiin, mutta sopivia palveluntarjoajia ei löytynyt vielä.";

        const {
          error: emailError,
        } =
          await resend.emails.send({
            from:
              "OmatJuhlat <noreply@omatjuhlat.fi>",
            to: email,
            subject:
              "Tarjouspyyntö vastaanotettu – OmatJuhlat",
            html: `
              <div style="margin:0;background:#fbf8f2;padding:32px 16px;font-family:Arial,sans-serif;color:#211b16;">
                <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8ded0;border-radius:20px;padding:32px;">
                  <p style="margin:0 0 8px;color:#9a773b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                    OmatJuhlat
                  </p>

                  <h1 style="margin:0 0 20px;font-size:26px;">
                    Tarjouspyyntösi on vastaanotettu
                  </h1>

                  <p>
                    <strong>Tapahtuma:</strong>
                    ${escapeHtml(eventType)}
                  </p>

                  <p>
                    <strong>Päivämäärä:</strong>
                    ${escapeHtml(date)}
                  </p>

                  <p>
                    <strong>Paikkakunta:</strong>
                    ${escapeHtml(location)}
                  </p>

                  <p style="margin-top:20px;line-height:1.7;color:#62584f;">
                    ${escapeHtml(matchMessage)}
                  </p>

                  <p style="margin:28px 0;">
                    <a
                      href="${escapeHtml(quoteUrl)}"
                      style="display:inline-block;padding:14px 22px;border-radius:12px;background:#b48a45;color:#ffffff;font-weight:700;text-decoration:none;"
                    >
                      Avaa tarjouspyyntösi
                    </a>
                  </p>

                  <p style="margin:0;color:#91877d;font-size:13px;line-height:1.6;">
                    Tämä linkki on henkilökohtainen. Älä jaa sitä muille.
                  </p>
                </div>
              </div>
            `,
          });

        if (emailError) {
          console.error(
            "REQUEST CONFIRMATION EMAIL ERROR:",
            emailError,
          );
        } else {
          confirmationEmailSent =
            true;
        }
      } catch (emailError) {
        console.error(
          "REQUEST CONFIRMATION EMAIL ERROR:",
          emailError,
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        quoteId: quote.id,
        accessToken:
          quote.access_token ??
          accessToken,
        confirmationEmailSent,
        matchedPartners:
          matchedPartnerCount,
        createdAssignments:
          quotePartnerRows.length,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "REQUEST QUOTES API ERROR:",
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