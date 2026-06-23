import { NextResponse } from "next/server";

import { supabase } from "../../../lib/supabase";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company, email, area, max_guests } = body;

    if (!company || !email || !area || !max_guests) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("partners").insert({
      company,
      email,
      area,
      max_guests: Number(max_guests),
      status: "pending",
    });

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