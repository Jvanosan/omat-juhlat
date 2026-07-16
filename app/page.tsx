"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/layout/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustSection from "@/components/sections/TrustSection";
import PartnerCTA from "@/components/sections/PartnerCTA";

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
  if (loading) return;

  setErrorMsg("");

  const cleanEmail = event.email.trim();
  const guests = Number(event.guests);

  if (
    !event.date ||
    !event.eventType ||
    !event.location ||
    !event.guests ||
    !cleanEmail ||
    selectedServices.length === 0
  ) {
    setErrorMsg(
      "Täytä päivämäärä, tapahtumatyyppi, paikkakunta, vierasmäärä, sähköposti ja valitse vähintään yksi palvelu."
    );
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    setErrorMsg("Anna kelvollinen sähköpostiosoite.");
    return;
  }

  if (!Number.isInteger(guests) || guests < 1) {
    setErrorMsg("Vierasmäärän täytyy olla vähintään 1.");
    return;
  }

  if (guests > 10000) {
    setErrorMsg("Vierasmäärä on liian suuri.");
    return;
  }

  const budget =
    event.budget.trim() === ""
      ? null
      : Number(event.budget);

  if (
    budget !== null &&
    (!Number.isFinite(budget) || budget < 0)
  ) {
    setErrorMsg("Budjetin täytyy olla 0 tai sitä suurempi.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/request-quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: event.date,
        eventType: event.eventType,
        location: event.location,
        guests,
        email: cleanEmail,
        budget,
        services: selectedServices,
        notes: event.notes.trim(),
      }),
    });

    const responseText = await response.text();

let result: any = {};

if (responseText) {
  try {
    result = JSON.parse(responseText);
  } catch {
    console.error("API RETURNED INVALID RESPONSE:", responseText);

    setErrorMsg(
      `Palvelin palautti virheellisen vastauksen. HTTP ${response.status}`
    );
    return;
  }
}

if (!response.ok) {
  console.error("REQUEST QUOTE API ERROR:", {
    status: response.status,
    responseText,
  });

  setErrorMsg(
    result.error ||
      `Tarjouspyynnön lähettäminen epäonnistui. HTTP ${response.status}`
  );
  return;
}

    if (!result.quoteId) {
      setErrorMsg(
        "Tarjouspyyntö tallennettiin, mutta sen tunnusta ei saatu."
      );
      return;
    }

    if (result.matchedPartners === 0) {
      alert(
        "Tarjouspyyntö tallennettiin, mutta sopivia palveluntarjoajia ei löytynyt vielä."
      );
    }

    router.push(`/quote/${result.quoteId}`);
  } catch (error) {
    console.error("REQUEST QUOTE ERROR:", error);

    setErrorMsg(
      "Yhteys palvelimeen epäonnistui. Yritä hetken kuluttua uudelleen."
    );
  } finally {
    setLoading(false);
  }
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
       <Hero />
       <HowItWorks />
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
  min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]}
  value={event.date}
  onChange={(e) => setEvent({ ...event, date: e.target.value })}style={{
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
<select
  value={event.location}
  onChange={(e) => setEvent({ ...event, location: e.target.value })}
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
  <option value="">Valitse paikkakunta</option>
  <option>Helsinki</option>
  <option>Espoo</option>
  <option>Vantaa</option>
  <option>Tampere</option>
  <option>Turku</option>
  <option>Oulu</option>
  <option>Jyväskylä</option>
  <option>Lahti</option>
  <option>Kuopio</option>
  <option>Joensuu</option>
  <option>Pori</option>
<option>Vaasa</option>
<option>Rovaniemi</option>
<option>Seinäjoki</option>
<option>Lappeenranta</option>
<option>Kotka</option>
<option>Mikkeli</option>
<option>Hämeenlinna</option>
<option>Salo</option>
<option>Kokkola</option>
<option>Kajaani</option>
<option>Rauma</option>
<option>Porvoo</option>
<option>Hyvinkää</option>
<option>Järvenpää</option>
<option>Lohja</option>
<option>Kerava</option>
<option>Tuusula</option>
<option>Nurmijärvi</option>
<option>Ylöjärvi</option>
<option>Nokia</option>
<option>Kangasala</option>
<option>Riihimäki</option>
<option>Savonlinna</option>
<option>Imatra</option>
<option>Raahe</option>
<option>Iisalmi</option>
<option>Varkaus</option>
<option>Kemi</option>
<option>Tornio</option>
<option>Pietarsaari</option>
<option>Forssa</option>
<option>Valkeakoski</option>
<option>Kuusamo</option>
<option>Kempele</option>
<option>Sipoo</option>
<option>Kirkkonummi</option>
<option>Vihti</option>
<option>Lempäälä</option>
<option>Pirkkala</option>
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
                Vierasmäärä *
              </label>

<input
  type="number"
  min={1}
  max={10000}
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
    maxLength={1000}
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
  min={0}
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


<TrustSection />
<PartnerCTA />
  


      </div>
    </main>
  );
}