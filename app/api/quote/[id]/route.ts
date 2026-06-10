import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: quoteId } = await context.params;

  if (!quoteId) {
    return NextResponse.json(
      { error: "quoteId puuttuu" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("request_quotes")
    .select("id, date, location, guests, email")
    .eq("id", quoteId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Tarjouspyyntöä ei löytynyt" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
``