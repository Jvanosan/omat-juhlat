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
  },
);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const date = String(
      searchParams.get("date") ?? "",
    ).trim();

    const partnerIds = Array.from(
      new Set(
        String(
          searchParams.get("partnerIds") ?? "",
        )
          .split(",")
          .map((id) => id.trim())
          .filter((id) =>
            UUID_PATTERN.test(id),
          ),
      ),
    ).slice(0, 100);

    if (!isValidDate(date)) {
      return NextResponse.json(
        {
          error:
            "Päivämäärä ei ole kelvollinen.",
        },
        { status: 400 },
      );
    }

    if (partnerIds.length === 0) {
      return NextResponse.json({
        unavailablePartnerIds: [],
      });
    }

    // Tarkistetaan vain julkiset ja hyväksytyt partnerit.
    const {
      data: publicPartners,
      error: partnersError,
    } = await supabase
      .from("partners")
      .select("id")
      .in("id", partnerIds)
      .eq("status", "approved")
      .eq("profile_completed", true);

    if (partnersError) {
      console.error(
        "PUBLIC AVAILABILITY PARTNERS ERROR:",
        partnersError,
      );

      return NextResponse.json(
        {
          error:
            "Palveluntarjoajia ei voitu tarkistaa.",
        },
        { status: 500 },
      );
    }

    const publicPartnerIds = (
      publicPartners ?? []
    ).map((partner) =>
      String(partner.id),
    );

    if (publicPartnerIds.length === 0) {
      return NextResponse.json({
        unavailablePartnerIds: [],
      });
    }

    const {
      data: entries,
      error: calendarError,
    } = await supabase
      .from("partner_calendar_entries")
      .select("partner_id")
      .eq("date", date)
      .in("partner_id", publicPartnerIds)
      .in("status", [
        "unavailable",
        "booked",
      ]);

    if (calendarError) {
      console.error(
        "PUBLIC AVAILABILITY CALENDAR ERROR:",
        calendarError,
      );

      return NextResponse.json(
        {
          error:
            "Saatavuuden tarkistaminen epäonnistui.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        unavailablePartnerIds:
          Array.from(
            new Set(
              (entries ?? []).map((entry) =>
                String(entry.partner_id),
              ),
            ),
          ),
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "PUBLIC PARTNER AVAILABILITY ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Palvelimella tapahtui odottamaton virhe.",
      },
      { status: 500 },
    );
  }
}