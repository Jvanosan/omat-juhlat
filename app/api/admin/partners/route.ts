import { NextResponse } from "next/server";

import {
  adminSupabase,
  isAuthorizedAdmin,
} from "@/lib/server/adminAuth";

export async function GET(request: Request) {
  try {
    const authorized =
      await isAuthorizedAdmin(request);

    if (!authorized) {
      return NextResponse.json(
        {
          error:
            "Sinulla ei ole oikeutta nähdä partnerihakemuksia.",
        },
        { status: 403 }
      );
    }

    const { data, error } =
      await adminSupabase
        .from("partners")
        .select(`
          id,
          company,
          email,
          area,
          max_guests,
          status
        `)
        .order("company", {
  ascending: true,
});

    if (error) {
      console.error(
        "ADMIN PARTNERS LOAD ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Partnerihakemusten hakeminen epäonnistui.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error(
      "ADMIN PARTNERS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Palvelimella tapahtui odottamaton virhe.",
      },
      { status: 500 }
    );
  }
}