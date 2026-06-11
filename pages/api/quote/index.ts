import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      email,
      eventType,
      date,
      guests,
      location,
      budget,
      extraInfo,
      services,
    } = req.body;

    // 1️⃣ Tallenna tarjous
    const { data: quote, error } = await supabase
      .from("request_quotes")
      .insert([
        {
          name,
          email,
          eventType,
          date,
          guests,
          location,
          budget,
          extraInfo,
          services,
          status: "avoin",
        },
      ])
      .select()
      .single();

    if (error || !quote) {
      return res.status(500).json({ error: "Database error" });
    }

    // 2️⃣ Automatch
    const minGuests = Math.floor(Number(guests) * 0.8);

    const { data: matchedPartners } = await supabase
      .from("partners")
      .select("id, email, services, area, max_guests")
      .eq("status", "approved")
      .overlaps("services", services)
      .or(`area.ilike.%${location}%,area.ilike.%Suomi%`)
      .gte("max_guests", minGuests);

    // 3️⃣ Partner‑emailit
    if (matchedPartners && matchedPartners.length > 0) {
      await supabase.from("quote_partners").insert(
        matchedPartners.map((p) => ({
          quote_id: quote.id,
          partner_id: p.id,
          status: "sent",
        }))
      );

      for (const partner of matchedPartners) {
        if (!partner.email) continue;

        await resend.emails.send({
          from: "Omat Juhlat <onboarding@resend.dev>",
          to: partner.email,
          subject: "Uusi tapahtumapyyntö",
          html: `
            <h3>Uusi tapahtumapyyntö</h3>
            <p><strong>Tapahtuma:</strong> ${eventType}</p>
            <p><strong>Sijainti:</strong> ${location}</p>
            <p><strong>Päivämäärä:</strong> ${date}</p>
            <p><strong>Vieraita:</strong> ${guests}</p>
            <p><strong>Palvelut:</strong> ${services.join(", ")}</p>
            <p><strong>Budjetti:</strong> Sovitaan erikseen</p>
          `,
        });
      }
    }

    // 4️⃣ Admin‑email
    await resend.emails.send({
      from: "Admin <onboarding@resend.dev>",
      to: "jvanosan2003@gmail.com",
      subject: "📩 Uusi tarjouspyyntö",
      html: `
        <p><strong>Nimi:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tapahtuma:</strong> ${eventType}</p>
        <p><strong>Sijainti:</strong> ${location}</p>
        <p><strong>Palvelut:</strong> ${services.join(", ")}</p>
      `,
    });

    // 5️⃣ Asiakas‑email
    await resend.emails.send({
      from: "Omat Juhlat <onboarding@resend.dev>",
      to: email,
      subject: "Kiitos tarjouspyynnöstäsi",
      html: `
        <p>Hei ${name},</p>
        <p>Tarjouspyyntösi on lähetetty sopiville kumppaneille.</p>
      `,
    });

    return res.status(200).json({ success: true, quoteId: quote.id });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}