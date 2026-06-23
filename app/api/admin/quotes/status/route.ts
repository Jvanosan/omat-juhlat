import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { quoteId, status } = await req.json();

    if (!quoteId || !status) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("request_quotes")
      .update({ status })
      .eq("id", quoteId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}