import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, partnerName, service } = await req.json();

    if (!to) {
      return NextResponse.json(
        { error: "Missing recipient email" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "OmatJuhlat <onboarding@resend.dev>",
      to,
      subject: "Uusi tarjouspyyntö – OmatJuhlat",
      html: `
        <h2>Hei ${partnerName ?? "partneri"},</h2>
        <p>Sinulle on lähetetty uusi tarjouspyyntö palvelusta:</p>
        <p><strong>${service}</strong></p>
        <p>Kirjaudu OmatJuhlat-palveluun nähdäksesi lisätiedot.</p>
        <br />
        <p>Terveisin,<br/>OmatJuhlat</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}