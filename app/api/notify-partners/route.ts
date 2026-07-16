import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    console.log("NOTIFY PARTNERS API CALLED");
  const { quoteId } = await req.json();

  // hae tarjouspyyntö
  const { data: quote } = await supabase
    .from("request_quotes")
    .select("*")
    .eq("id", quoteId)
    .single();

  // hae quote_partners + partnerit
  const { data: qp } = await supabase
  .from("quote_partners")
  .select("partner_id, service")
  .eq("quote_id", quoteId);

  const { data: partners } = await supabase
    .from("partners")
    .select("id, email, company");

  if (!qp || !partners) {
    return Response.json({ ok: false });
  }

  for (const row of qp) {
    const partner = partners.find(p => p.id === row.partner_id);
    if (!partner?.email) continue;

    await resend.emails.send({
from: "OmatJuhlat <noreply@omatjuhlat.fi>",      to: partner.email,
      subject: "📩 Uusi tarjouspyyntö – OmatJuhlat",
      html: `
        <h2>Sinulle on tullut uusi tarjouspyyntö</h2>
        <p><strong>Palvelu:</strong> ${row.service}</p>
        <p><strong>Tapahtuma:</strong> ${quote.event_type}</p>
        <p><strong>Päivämäärä:</strong> ${quote.date}</p>

        <p>
          <a href="https://omat-juhlat.vercel.app/partner">
            👉 Avaa tarjouspyyntö
          </a>
        </p>
      `,
    });
  }

  return Response.json({ ok: true });
}