import { NextResponse } from "next/server";

import { supabase } from "../../../../lib/supabase";

 export async function GET() {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("id, company, email, area, max_guests, status");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}