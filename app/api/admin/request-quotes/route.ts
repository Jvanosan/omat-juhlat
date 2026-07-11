import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client (service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("request_quotes")
      .select("*")
      .order("created_at", { ascending: false });

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
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status", body },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("request_quotes")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
