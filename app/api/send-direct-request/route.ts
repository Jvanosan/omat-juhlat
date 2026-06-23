import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, event_date, guests, partner_ids } = body;

    await resend.emails.send({
      from: "OmatJuhlat <onboarding@resend.dev>",
      to: ["jvanosan2003@gmail.com"], // ✅ SINUN EMAIL
      subject: "Uusi suora tarjouspyyntö",
      html: `
        <h2>Uusi suora tarjouspyyntö</h2>
        <p><strong>Sähköposti:</strong> ${email}</p>
        <p><strong>Päivämäärä:</strong> ${event_date}</p>
        <p><strong>Vierasmäärä:</strong> ${guests}</p>
        <p><strong>Valitut partnerit:</strong></p>
        <pre>${JSON.stringify(partner_ids, null, 2)}</pre>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response("Email failed", { status: 500 });
  }
}