import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

const ALLOWED_SERVICES = [
  "juhlatila",
  "catering",
  "dj",
  "band",
  "photographer",
  "decor",
] as const;

const SERVICE_ALIASES: Record<string, string> = {
  juhlatila: "juhlatila",
  "juhla tila": "juhlatila",
  "juhla-tila": "juhlatila",
  juhlatilat: "juhlatila",

  catering: "catering",
  ravintola: "catering",
  ruokailu: "catering",
  pitopalvelu: "catering",

  dj: "dj",
  musiikki: "dj",
  "dj musiikki": "dj",
  "dj & musiikki": "dj",
  "dj / musiikki": "dj",

  band: "band",
  bändi: "band",
  yhtye: "band",
  "bändi / live-musiikki": "band",
  "live-musiikki": "band",

  photographer: "photographer",
  valokuvaaja: "photographer",
  valokuvaus: "photographer",
  kuvaaja: "photographer",

  decor: "decor",
  somistus: "decor",
  koristelu: "decor",
  "somistus / koristelu": "decor",
};

function normalizeService(value: unknown): string {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return SERVICE_ALIASES[normalized] ?? normalized;
}

function parsePartnerServices(value: unknown): string[] {
  if (!value) return [];

  return Array.from(
    new Set(
      String(value)
        .replace(/[\[\]()"']/g, "")
        .split(/[,;&/]+/)
        .map(normalizeService)
        .filter(Boolean)
    )
  );
}

function parsePartnerAreas(value: unknown): string[] {
  if (!value) return [];

  return String(value)
    .split(/[,;]+/)
    .map((area) => area.trim().toLowerCase())
    .filter(Boolean);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const date = String(body.date ?? "").trim();
    const eventType = String(body.eventType ?? "").trim();
    const location = String(body.location ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const notes = String(body.notes ?? "").trim();

    const guests = Number(body.guests);
    const budget =
      body.budget === "" ||
      body.budget === null ||
      body.budget === undefined
        ? null
        : Number(body.budget);

    const services = Array.isArray(body.services)
      ? Array.from(
          new Set(body.services.map(normalizeService).filter(Boolean))
        )
      : [];

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
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Anna kelvollinen sähköpostiosoite." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 10000) {
      return NextResponse.json(
        { error: "Vierasmäärän täytyy olla 1–10 000." },
        { status: 400 }
      );
    }

    if (
      budget !== null &&
      (!Number.isFinite(budget) || budget < 0)
    ) {
      return NextResponse.json(
        { error: "Budjetti ei voi olla negatiivinen." },
        { status: 400 }
      );
    }

    const invalidService = services.find(
      (service) =>
        !ALLOWED_SERVICES.includes(
          service as (typeof ALLOWED_SERVICES)[number]
        )
    );

    if (invalidService) {
      return NextResponse.json(
        { error: `Tuntematon palvelu: ${invalidService}` },
        { status: 400 }
      );
    }

    const selectedDate = new Date(`${date}T00:00:00`);

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

    // 1. Luo tarjouspyyntö
    const { data: quote, error: quoteError } = await supabase
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
      })
      .select("id")
      .single();

    if (quoteError || !quote) {
      console.error("REQUEST QUOTE INSERT ERROR:", quoteError);

      return NextResponse.json(
        { error: "Tarjouspyynnön tallentaminen epäonnistui." },
        { status: 500 }
      );
    }

    // 2. Hae vain hyväksytyt partnerit
    const { data: partners, error: partnersError } = await supabase
      .from("partners")
      .select(
        "id, company, email, services, area, max_guests, status"
      )
      .eq("status", "approved");

    if (partnersError) {
      console.error("PARTNERS SELECT ERROR:", partnersError);

      return NextResponse.json(
        {
          error:
            "Tarjouspyyntö tallennettiin, mutta partnereita ei voitu hakea.",
          quoteId: quote.id,
        },
        { status: 500 }
      );
    }

    const requestedLocation = location.toLowerCase();

    const quotePartnerRows: Array<{
      quote_id: number | string;
      partner_id: string;
      service: string;
      status: string;
    }> = [];

    // 3. Tarkista palvelu, alue ja kapasiteetti
    for (const partner of partners ?? []) {
      const partnerServices = parsePartnerServices(partner.services);
      const partnerAreas = parsePartnerAreas(partner.area);

      const areaMatches =
        partnerAreas.includes(requestedLocation) ||
        partnerAreas.includes("suomi") ||
        partnerAreas.includes("koko suomi");

      const capacityMatches =
        partner.max_guests === null ||
        partner.max_guests === undefined ||
        Number(partner.max_guests) >= guests;

      if (!areaMatches || !capacityMatches) continue;

      const requestedServices: string[] = Array.isArray(services)
  ? services.filter(
      (service): service is string => typeof service === "string"
    )
  : [];

const matchedServices = requestedServices.filter((service) =>
  partnerServices.includes(service)
);

      for (const service of matchedServices) {
        quotePartnerRows.push({
          quote_id: quote.id,
          partner_id: partner.id,
          service,
          status: "sent",
        });
      }
    }

    // 4. Luo partnerikohtaiset rivit
    if (quotePartnerRows.length > 0) {
      const { error: assignmentsError } = await supabase
        .from("quote_partners")
        .upsert(quotePartnerRows, {
          onConflict: "quote_id,partner_id,service",
          ignoreDuplicates: true,
        });

      if (assignmentsError) {
        console.error(
          "QUOTE PARTNERS INSERT ERROR:",
          assignmentsError
        );

        return NextResponse.json(
          {
            error:
              "Tarjouspyyntö tallennettiin, mutta sitä ei voitu yhdistää partnereihin.",
            quoteId: quote.id,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        quoteId: quote.id,
        matchedPartners: new Set(
          quotePartnerRows.map((row) => row.partner_id)
        ).size,
        createdAssignments: quotePartnerRows.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REQUEST QUOTES API ERROR:", error);

    return NextResponse.json(
      { error: "Palvelimella tapahtui odottamaton virhe." },
      { status: 500 }
    );
  }
}