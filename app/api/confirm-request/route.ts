import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, quoteId, eventType, date } = await req.json();

  try {
    await resend.emails.send({
      from: "OmatJuhlat <onboarding@resend.dev>",
      to: email,
      subject: "✅ Tarjouspyyntö vastaanotettu",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #111;">Tarjouspyyntösi on vastaanotettu ✅</h2>

          <p><b>Tapahtuma:</b> ${eventType}</p>
          <p><b>Päivämäärä:</b> ${date}</p>

          <p>
            Palveluntarjoajat käsittelevät pyyntöäsi ja saat pian tarjouksia.
          </p>

          https://omat-juhlat.vercel.app/quote/${quoteId}
            👉 Avaa tarjouspyyntösi
          </a>

          <p style="margin-top:20px;">
            Kiitos kun käytit OmatJuhlat 💙
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return NextResponse.json(
      { error: "Email send failed" },
      { status: 500 }
    );
  }
}