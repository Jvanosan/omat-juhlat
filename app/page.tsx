"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const EVENT_TYPES = [
  "Syntymäpäivä",
  "Häät",
  "Valmistujaiset",
  "Yritysjuhla",
  "Ristiäiset",
  "Muu juhla",
];

const SERVICES = [
  { id: "juhlatila", label: "Juhlatila" },
  { id: "catering", label: "Catering" },
  { id: "dj", label: "DJ" },
  { id: "band", label: "Bändi / live-musiikki" },
  { id: "photographer", label: "Valokuvaaja" },
  { id: "decor", label: "Somistus / koristelu" },
];

export default function HomePage() {
  const router = useRouter();

  const [event, setEvent] = useState({
    date: "",
    eventType: "",
    location: "",
    guests: "",
    budget: "",
    email: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  }
async function submit() {
console.log("SUBMIT AJETTU");
    setErrorMsg("");

    // ✅ VALIDOINNIT (EI setStatea renderissä)
    if (
      !event.date ||
      !event.location ||
      !event.guests ||
      !event.email ||
      selectedServices.length === 0
    ) {
      setErrorMsg(
        "Täytä päivämäärä, alue, vierasmäärä, sähköposti ja valitse vähintään yksi palvelu."
      );
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("request_quotes")
      .insert({
        date: event.date,
        event_type: event.eventType,
        location: event.location,
        guests: Number(event.guests),
        email: event.email,
        budget: event.budget ? Number(event.budget) : null,
        services: selectedServices,
        status: "avoin",
      })
      .select()
      .single();
      // ✅ LUODAAN quote_partners-RIVIT KAIKILLE PARTNEREILLE
const { data: partners } = await supabase
  .from("partners")
  .select("id");

if (partners && partners.length > 0) {
  const rows = partners.map((partner) => ({
    quote_id: data.id,
    partner_id: partner.id,
    service: selectedServices[0], // toistaiseksi yksi palvelu
    status: "offered",
  }));

  await supabase.from("quote_partners").insert(rows);
}
// 2️⃣ luo quote_partners-rivit
if (partners) {
  const rows = [];

  for (const partner of partners) {
    // varmista että partnerServices on AINA array
let partnerServices: string[] = [];

if (Array.isArray(partner.services)) {
  partnerServices = partner.services;
} else if (typeof partner.services === "string") {
  // jos esim "catering,dj"
  partnerServices = partner.services
    .split(",")
    .map((s) => s.trim());
}

await fetch("/api/notify-partners", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ quoteId: data.id }),
});
// tarkista osuuko asiakkaan valintoihin
const match = partnerServices.some((s) =>
  selectedServices.includes(s)
);

    if (match) {
      rows.push({
        quote_id: data.id,
        partner_id: partner.id,
        service: partnerServices.find((s) =>
          selectedServices.includes(s)
        ),
        status: "offered",
      });
    }
  }

  if (rows.length > 0) {
    await supabase.from("quote_partners").insert(rows);
  }
}

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    router.push(`/quote/${data.id}`);
  }
return (
  <main
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/juhlat.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  }}
>
    <div style={{ width: "100%", maxWidth: 720, padding: 40 }}>
      {/* 🎉 HERO – JUHLATUNNELMA */}
<div
  style={{
    background: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(6px)",
    borderRadius: 24,
    padding: "60px 30px",
    marginBottom: 40,
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  }}
>
   <h1
  style={{
    color: "#ffffff",
    fontSize: 44,
    fontWeight: "bold",
    textShadow: "0 2px 6px rgba(0,0,0,0.6)",
    marginBottom: 16,
  }}
>
   Järjestä juhlat helposti 
</h1>

  <p
  style={{
    fontSize: 20,
    color:"#ffffff",
    lineHeight: 1.6,
    maxWidth: 600,
    margin: "0 auto 30px",
  }}
>
    Täytä juhlan tiedot, saat tarjoukset luotettavilta
    juhlapalveluilta ja valitset parhaan – rauhassa ja
    ilman sitoumuksia.
  </p>

  <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
  {/* ✅ Massatarjous */}
  <a
    href="#lomake"
    style={{
      display: "inline-block",
      padding: "14px 28px",
      borderRadius: 999,
      background: "linear-gradient(90deg, #10b981, #34d399)",
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      textDecoration: "none",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    }}
  >
    🎊 Pyydä tarjouksia
  </a>

  {/* ✅ UUSI: suora selaus */}
  <a
    href="/browse"
    style={{
      display: "inline-block",
      padding: "14px 28px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.15)",
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "bold",
      textDecoration: "none",
      border: "1px solid rgba(255,255,255,0.4)",
      backdropFilter: "blur(6px)",
    }}
  >
    ✨ Ota yhteyttä suoraan palveluntarjoajan
  </a>
</div>
</div>
      <div
        style={{
          background: "#ecfeff",
          border: "1px solid #67e8f9",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <strong>🔍 Mitä tapahtuu seuraavaksi?</strong>
        <ol style={{ marginTop: 8 }}>
          <li>Täytät tapahtuman tiedot</li>
          <li>Valitset tarvitsemasi palvelut</li>
          <li>Saat tarjoukset partnereilta</li>
          <li>Valitset parhaan ja vahvistat</li>
        </ol>
      </div>

      {errorMsg && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            fontWeight: "bold",
          }}
        >
          {errorMsg}
        </div>
      )}

<h2
  id="lomake"
  style={{
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 16,
    textShadow: "0 2px 6px rgba(0,0,0,0.6)",
  }}
>
  Tapahtuman tiedot
</h2>
      <div
  style={{
    background: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    color: "#111",
  }}
>
        <label style={{ color: "#111", fontWeight: "600" }}>
  Päivämäärä *
          <input
            type="date"
            value={event.date}
            onChange={(e) =>
              setEvent({ ...event, date: e.target.value })
            }
            style={{
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  color: "#111"
   backgroundColor: "#fff"
}}
          />
        </label>

        <label style={{ color: "#111", fontWeight: "600" }}>2
          Tapahtuman tyyppi *
          <select
  value={event.eventType}
  onChange={(e) =>
    setEvent({ ...event, eventType: e.target.value })
  }
  style={{
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    color: "#111",
    backgroundColor: "#fff"
  }}
>
            <option value="">Valitse tapahtuman tyyppi</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label style={{ color: "#111", fontWeight: "600" }}>2
          Paikkakunta *
          <input
            value={event.location}
            onChange={(e) =>
              setEvent({ ...event, location: e.target.value })
            }
style={{
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  color: "#111"
   backgroundColor: "#fff"
}}          />
        </label>

        <label style={{ color: "#111", fontWeight: "600" }}>2
          Vierasmäärä *
          <input
            type="number"
            value={event.guests}
            onChange={(e) =>
              setEvent({ ...event, guests: e.target.value })
            }
style={{
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  color: "#111"
   backgroundColor: "#fff"
}}          />
        </label>

        <label> style={{ color: "#111", fontWeight: "600" }}>
          Sähköposti *
          <input
            type="email"
            value={event.email}
            onChange={(e) =>
              setEvent({ ...event, email: e.target.value })
            }
style={{
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  color: "#111"
   backgroundColor: "#fff"
}}          />
        </label>

        <label>style={{ color: "#111", fontWeight: "600" }}>
          Budjetti (valinnainen)
          <input
            type="number"
            value={event.budget}
            onChange={(e) =>
              setEvent({ ...event, budget: e.target.value })
            }
style={{
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  color: "#111"
   backgroundColor: "#fff"
}}          />
        </label>
      </div>

<h2
  style={{
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 16,
    textShadow: "0 2px 6px rgba(0,0,0,0.6)",
  }}
>
  Valitse palvelut *
</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {SERVICES.map((s) => {
          const selected = selectedServices.includes(s.id);

          return (
            <div
              key={s.id}
              onClick={() => toggleService(s.id)}
              style={{
                cursor: "pointer",
                padding: 16,
                borderRadius: 12,
                border: selected
                  ? "2px solid #10b981"
                  : "1px solid #ddd",
                background: selected ? "#ecfdf5" : "#fff",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{s.label}</span>
              <input type="checkbox" checked={selected} readOnly />
            </div>
          );
        })}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        style={{
          marginTop: 24,
          width: "100%",
          padding: "14px 20px",
          fontSize: 18,
          fontWeight: "bold",
          borderRadius: 12,
          border: "none",
          background: loading
            ? "#9ca3af"
            : "linear-gradient(90deg, #10b981, #34d399)",
          color: "white",
        }}
      >
        {loading ? "Lähetetään…" : " Pyydä tarjoukset"}
      </button>
    </div>
  </main>
);
}