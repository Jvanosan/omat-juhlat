import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const id = formData.get("id");

  await supabase
    .from("request_quotes")
    .delete()
    .eq("id", id);

  return NextResponse.redirect("http://localhost:3000/admin");
}