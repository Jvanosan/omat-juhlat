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
    notes: "",
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

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const { data: partners } = await supabase.from("partners").select("id, services");

    let rows: any[] = [];

if (partners && partners.length > 0) {
  for (const partner of partners) {
    let partnerServices: string[] = [];

    if (Array.isArray(partner.services)) {
      partnerServices = partner.services;
    } else if (typeof partner.services === "string") {
      partnerServices = partner.services
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    }

    const matchedService = partnerServices.find((s) =>
      selectedServices.includes(s)
    );

    if (!matchedService) continue;

    rows.push({
      quote_id: data.id,
      partner_id: partner.id,
      partner_name: partner.company,
      service: matchedService,
      status: "offered",
    });
  }
}

if (rows.length > 0) {
  await supabase.from("quote_partners").insert(rows);
}

      await fetch("/api/notify-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: data.id }),
      });
    

    await fetch("/api/confirm-request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: event.email,
    quoteId: data.id,
    eventType: event.eventType,
    date: event.date,
  }),
});
    setLoading(false);

    router.push(`/quote/${data.id}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/juhlat.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "20px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          padding: "20px",
          borderRadius: "16px",
        }}
      >
        {/* HERO SECTION */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            padding: "50px 30px",
            marginBottom: "32px",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontSize: "36px",
              fontWeight: "bold",
              textShadow: "0 2px 8px rgba(0,0,0,0.7)",
              marginBottom: "16px",
              lineHeight: "1.3",
            }}
          >
            Järjestä juhlat helposti
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#e0f2fe",
              lineHeight: "1.6",
              maxWidth: "600px",
              margin: "0 auto 28px",
            }}
          >
            Täytä juhlan tiedot, saat tarjoukset luotettavilta juhlapalveluilta ja valitset parhaan – rauhassa ja ilman sitoumuksia.
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <a
              href="#lomake"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #10b981, #34d399)",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: "none",
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              🎊 Pyydä tarjoukset nyt
            </a>
            <a
              href="/browse"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
            >
              ✨ Ota yhteyttä suoraan palveluntarjoajaan
            </a>
          </div>
        </div>

        {/* INFO BOX */}
        <div
          style={{
            background: "#ecfeff",
            border: "1px solid #67e8f9",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            fontSize: "15px",
          }}
        >
          <strong style={{ color: "#065f46" }}>🔍 Mitä tapahtuu seuraavaksi?</strong>
          <ol style={{ marginTop: "8px", paddingLeft: "20px", color: "#065f46", lineHeight: "1.6" }}>
            <li>Täytät tapahtuman tiedot</li>
            <li>Valitset tarvitsemasi palvelut</li>
            <li>Saat tarjoukset luotettuilta palveluntarjoajilta</li>
            <li>Valitset parhaan vaihtoehdon ja vahvistat yhteistyön</li>
          </ol>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontWeight: "bold",
              border: "1px solid #fecaca",
              fontSize: "14px",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* FORM */}
        <h2
          id="lomake"
          style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: "bold",
            marginTop: "32px",
            marginBottom: "16px",
            textShadow: "0 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          Tapahtuman tiedot
        </h2>

        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "16px",
            marginBottom: "32px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            color: "#111",
          }}
        >
          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#111",
                  fontSize: "15px",
                }}
              >
                Päivämäärä *
              </label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  fontSize: "16px",
                  color: "#111",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#111",
                  fontSize: "15px",
                }}
              >
                Tapahtuman tyyppi *
              </label>
              <select
                value={event.eventType}
                onChange={(e) => setEvent({ ...event, eventType: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  fontSize: "16px",
                  color: "#111",
                }}
              >
                <option value="">Valitse tapahtuman tyyppi</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#111",
                  fontSize: "15px",
                }}
              >
                Paikkakunta *
              </label>
              <input
                type="text"
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                placeholder="Esimerkiksi Helsinki, Tampere..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  fontSize: "16px",
                  color: "#111",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#111",
                  fontSize: "15px",
                }}
              >
                Vierasmäärä *
              </label>
              <input
                type="number"
                value={event.guests}
                onChange={(e) => setEvent({ ...event, guests: e.target.value })}
                placeholder="Kuinka monta vierasta?"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  fontSize: "16px",
                  color: "#111",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#111",
                  fontSize: "15px",
                }}
              >
                Sähköposti *
              </label>
              <input
                type="email"
                value={event.email}
                onChange={(e) => setEvent({ ...event, email: e.target.value })}
                placeholder="esimerkki@domain.fi"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  fontSize: "16px",
                  color: "#111",
                }}
              />
            </div>
            <div>
  <label
    style={{
      display: "block",
      marginBottom: "6px",
      fontWeight: "600",
      color: "#111",
      fontSize: "15px",
    }}
  >
    Lisätiedot (valinnainen)
  </label>

  <textarea
    value={event.notes}
    onChange={(e) =>
      setEvent({ ...event, notes: e.target.value })
    }
    placeholder="Esim. juhlan teema, erityistoiveet..."
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      backgroundColor: "#fff",
      fontSize: "16px",
      color: "#111",
      minHeight: "100px",
    }}
  />
</div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#111",
                  fontSize: "15px",
                }}
              >
                Budjetti (valinnainen)
              </label>
              <input
                type="number"
                value={event.budget}
                onChange={(e) => setEvent({ ...event, budget: e.target.value })}
                placeholder="Budjetti euroina"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  fontSize: "16px",
                  color: "#111",
                }}
              />
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <h2
          style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: "bold",
            marginTop: "24px",
            marginBottom: "16px",
            textShadow: "0 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          Valitse palvelut *
        </h2>

        <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
          {SERVICES.map((s) => {
            const selected = selectedServices.includes(s.id);
            return (
              <div
                key={s.id}
                onClick={() => toggleService(s.id)}
                style={{
                  cursor: "pointer",
                  padding: "16px",
                  borderRadius: "12px",
                  border: selected ? "2px solid #10b981" : "1px solid #ddd",
                  background: selected ? "#ecfdf5" : "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.15s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontWeight: "500", color: "#111" }}>{s.label}</span>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    border: "2px solid #10b981",
                    background: selected ? "#10b981" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {selected && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6L5 8L9 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SUBMIT BUTTON */}
<button
  onClick={submit}
  disabled={loading}
  style={{
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "12px",
    border: "none",
    background: loading
      ? "#9ca3af"
      : "linear-gradient(90deg, #10b981, #34d399)",
    color: "white",
    cursor: loading ? "not-allowed" : "pointer",
    boxShadow: loading
      ? "none"
      : "0 8px 20px rgba(16, 185, 129, 0.3)",
    transition: "all 0.2s ease",
  }}
  onMouseOver={(e) => {
    if (!loading) {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 10px 25px rgba(16, 185, 129, 0.35)";
    }
  }}
  onMouseOut={(e) => {
    if (!loading) {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
    }
  }}
>
  {loading ? "⏳ Lähetetään..." : "🎊 Pyydä tarjoukset nyt"}
</button>
      </div>
    </main>
  );
}