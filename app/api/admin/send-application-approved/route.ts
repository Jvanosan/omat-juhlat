import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim();
    const contactName = String(body.contactName || "").trim();
    const companyName = String(body.companyName || "").trim();

    if (!email) {
      return NextResponse.json(
        { error: "Sähköpostiosoite puuttuu." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "OmatJuhlat <onboarding@resend.dev>",
      to: email,
      subject: "Partnerihakemuksesi on hyväksytty – OmatJuhlat",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <h1 style="color: #9a7611;">
            Tervetuloa OmatJuhlat-kumppaniksi!
          </h1>

          <p>Hei ${contactName || "kumppani"},</p>

          <p>
            Yrityksen <strong>${companyName || "hakemus"}</strong>
            partnerihakemus on hyväksytty.
          </p>

          <p>
            Olemme sinuun pian yhteydessä kirjautumistunnuksista
            ja seuraavista vaiheista.
          </p>

          <p>
            Ystävällisin terveisin,<br />
            <strong>OmatJuhlat-tiimi</strong>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });
  } catch (error) {
    console.error("Email route error:", error);

    return NextResponse.json(
      { error: "Sähköpostin lähettäminen epäonnistui." },
      { status: 500 }
    );
  }
}