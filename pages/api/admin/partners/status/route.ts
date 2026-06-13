import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { partnerId, status } = await req.json();

    if (!partnerId || !status) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 1️⃣ Päivitä status
    const { error: updateError } = await supabase
      .from("partners")
      .update({ status })
      .eq("id", partnerId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // 2️⃣ Jos hyväksytty → hae partner
    if (status === "approved") {
      const { data: partner } = await supabase
        .from("partners")
        .select("email, company")
        .eq("id", partnerId)
        .single();

      if (partner?.email) {
        await resend.emails.send({
          from: "OmatJuhlat <onboarding@resend.dev>",
          to: partner.email,
          subject: "🎉 Teidät on hyväksytty OmatJuhlat‑kumppaniksi!",
         html: `
  <div style="font-family: Arial, sans-serif; line-height:1.6;">
    <h2>Tervetuloa mukaan, ${partner.company}! 🎉</h2>

    <p>
      Yrityksenne on nyt hyväksytty OmatJuhlat‑kumppaniksi.
    </p>

    <p>
      Täydennä profiilisi tästä linkistä:
    </p>

    <p>
  <a href="http://localhost:3000/partner/complete?partnerId=${partnerId}">
    Täydennä profiilisi
  </a>
</p>

    <p>
      Tervetuloa mukaan,<br/>
      <strong>OmatJuhlat‑tiimi</strong>
    </p>
  </div>
`,
              
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
