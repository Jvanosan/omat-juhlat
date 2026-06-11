import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();

  const id = formData.get("id");
  const status = formData.get("status");

  console.log("UPDATE:", id, status);

  // ✅ TÄRKEÄ MUUTOS TÄSSÄ
  const { data, error } = await supabase
    .from("request_quotes")
    .update({ status: String(status) })
    .eq("id", parseInt(id as string)) // ❗ EI Number(id)
    .select();

  console.log("RESULT DATA:", data);
  console.log("RESULT ERROR:", error);

  return NextResponse.redirect("http://localhost:3000/admin");
}