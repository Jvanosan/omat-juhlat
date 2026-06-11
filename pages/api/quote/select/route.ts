import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { quotePartnerId, service, action } = body;
  // action = "select" | "unselect"

  if (!quotePartnerId || !service || !action) {
    return NextResponse.json(
      { error: "Missing data" },
      { status: 400 }
    );
  }

  // ✅ VALINTA
  if (action === "select") {
    // 1️⃣ Valittu -> selected
    const { error: selectError } = await supabase
      .from("quote_partners")
      .update({ status: "selected" })
      .eq("id", quotePartnerId);

    if (selectError) {
      return NextResponse.json(
        { error: selectError.message },
        { status: 500 }
      );
    }

    // 2️⃣ Selvitetään quote_id
    const { data: current, error: fetchError } = await supabase
      .from("quote_partners")
      .select("quote_id")
      .eq("id", quotePartnerId)
      .single();

    if (fetchError || !current) {
      return NextResponse.json(
        { error: "Could not determine quote_id" },
        { status: 500 }
      );
    }

    // 3️⃣ Muut saman servicessä JA samassa tarjouspyynnössä -> responded
    const { error: resetError } = await supabase
      .from("quote_partners")
      .update({ status: "responded" })
      .eq("quote_id", current.quote_id)
      .eq("service", service)
      .neq("id", quotePartnerId);

    if (resetError) {
      return NextResponse.json(
        { error: resetError.message },
        { status: 500 }
      );
    }
  }

  // ✅ POISTO
  if (action === "unselect") {
    const { error } = await supabase
      .from("quote_partners")
      .update({ status: "responded" })
      .eq("id", quotePartnerId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
