import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const quoteId = searchParams.get("quoteId");

  if (!quoteId) {
    return NextResponse.json(
      { error: "quoteId puuttuu" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("quote_partners")
    .select(`
      id,
      status,
      service,
      partner:partners (
        id,
        company,
        area,
        services,
        images,
        partner_details
      )
    `)
    .eq("quote_id", quoteId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}