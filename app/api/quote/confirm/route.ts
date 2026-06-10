import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
export async function POST(req: Request) {
  const { quoteId } = await req.json();

  if (!quoteId) {
    return NextResponse.json(
      { error: "quoteId puuttuu" },
      { status: 400 }
    );
  }

  // 1️⃣ Hae kaikki selected-rivit tähän tarjouspyyntöön
  const { data: selectedItems, error: fetchError } = await supabase
    .from("quote_partners")
    .select("id, service")
    .eq("quote_id", quoteId)
    .eq("status", "selected");

    // 📄 Hae tarjouspyynnön tiedot (asiakas)
const { data: quote, error: quoteError } = await supabase
  .from("request_quotes")
  .select("email, date, location, guests")
  .eq("id", quoteId)
  .single();

if (quoteError || !quote) {
  return NextResponse.json(
    { error: "Asiakkaan tietoja ei löytynyt" },
    { status: 500 }
  );
}
  if (fetchError) {
    return NextResponse.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  // 2️⃣ Käy palvelu kerrallaan
  for (const item of selectedItems || []) {
    // ✅ hyväksy valittu
    const { error: acceptError } = await supabase
      .from("quote_partners")
      .update({ status: "accepted" })
      .eq("id", item.id);

    if (acceptError) {
      return NextResponse.json(
        { error: acceptError.message },
        { status: 500 }
      );
    }

    // ❌ hylkää muut saman kategorian
    const { error: rejectError } = await supabase
      .from("quote_partners")
      .update({ status: "rejected" })
      .eq("quote_id", quoteId)
      .eq("service", item.service)
      .neq("id", item.id);

    if (rejectError) {
      return NextResponse.json(
        { error: rejectError.message },
        { status: 500 }
      );
    }
  }
  // 📧 Hae hyväksytyt partnerit ja heidän sähköpostit
const { data: acceptedPartners, error: partnerError } = await supabase
  .from("quote_partners")
  .select(`
    service,
    partner:partners (
      email,
      company
    )
  `)
  .eq("quote_id", quoteId)
  .eq("status", "accepted");

if (partnerError) {
  return NextResponse.json(
    { error: partnerError.message },
    { status: 500 }
  );
}
 // 📧 Email asiakkaalle
await resend.emails.send({
  from: "OmatJuhlat <no-reply@omatjuhlat.fi>",
  to:  quote.email, // korvataan seuraavassa vaiheessa oikealla
  subject: "✅ Varaus vahvistettu – OmatJuhlat",
  html: `
  <h2>Varaus vahvistettu 🎉</h2>
  <p>Kiitos varauksestasi! Varaus on nyt vahvistettu.</p>

  <p><strong>Päivämäärä:</strong> ${quote.date}</p>
  <p><strong>Sijainti:</strong> ${quote.location}</p>
  <p><strong>Vierasmäärä:</strong> ${quote.guests}</p>

  <p>Partnerit ovat teihin yhteydessä ennen tapahtumaa.</p>

  <p><strong>Varausnumero:</strong> ${quoteId}</p>

  <p>Ystävällisin terveisin,<br/>OmatJuhlat</p>
`,
});
// 📧 Email hyväksytyille partnereille
for (const p of acceptedPartners || []) {
  await resend.emails.send({
    from: "OmatJuhlat <no-reply@omatjuhlat.fi>",
    to: p.partner.email,
    subject: "📅 Uusi varaus vahvistettu – OmatJuhlat",
    html: `
      <h2>Uusi varaus vahvistettu</h2>

      <p>Teidän palvelunne on varattu OmatJuhlat‑palvelun kautta.</p>

      <p><strong>Palvelu:</strong> ${p.service}</p>
      <p><strong>Päivämäärä:</strong> ${quote.date}</p>
      <p><strong>Vierasmäärä:</strong> ${quote.guests}</p>

      <p>Asiakas ottaa teihin yhteyttä tarvittaessa ennen tapahtumaa.</p>

      <p>Ystävällisin terveisin,<br/>OmatJuhlat</p>
    `,
  });
}
const adminPartnerList = (acceptedPartners || [])
  .map(
    p => `<li><strong>${p.service}</strong>: ${p.partner.company}</li>`
  )
  .join("");
  // 📧 Email adminille
await resend.emails.send({
  from: "OmatJuhlat <no-reply@omatjuhlat.fi>",
  to: "admin@omatjuhlat.fi", // vaihda oma admin-email
  subject: "📊 Uusi varaus – OmatJuhlat",
  html: `
    <h2>Uusi varaus vahvistettu</h2>

    <p><strong>Varausnumero:</strong> ${quoteId}</p>
    <p><strong>Asiakas:</strong> ${quote.email}</p>

    <p><strong>Päivämäärä:</strong> ${quote.date}</p>
    <p><strong>Sijainti:</strong> ${quote.location}</p>
    <p><strong>Vierasmäärä:</strong> ${quote.guests}</p>

    <h3>Varatut palvelut</h3>
    <ul>
      ${adminPartnerList}
    </ul>

    <p>Tämä on automaattinen viesti OmatJuhlat‑järjestelmästä.</p>
  `,
});
  return NextResponse.json({ success: true });
}