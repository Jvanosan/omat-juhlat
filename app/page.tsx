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
  !event.eventType ||
  !event.location ||
  !event.guests ||
  !event.email ||
  selectedServices.length === 0
)
     {
      setErrorMsg(
"Täytä päivämäärä, tapahtumatyyppi, paikkakunta, vierasmäärä, sähköposti ja valitse vähintään yksi palvelu."      );

const guests = Number(event.guests);

if (guests < 1) {
  setErrorMsg("Vierasmäärän täytyy olla vähintään 1.");
  return;
}

if (guests > 10000) {
  setErrorMsg("Vierasmäärä on liian suuri.");
  return;
}     
return;
    }
const budget = event.budget ? Number(event.budget) : null;

if (budget !== null && budget < 0) {
  setErrorMsg("Budjetti ei voi olla negatiivinen.");
  return;
}

const selectedDate = new Date(event.date);

const earliest = new Date();
earliest.setDate(earliest.getDate() + 3);
earliest.setHours(0, 0, 0, 0);

if (selectedDate < earliest) {
  setErrorMsg("Valitse päivä vähintään 3 päivän päähän.");
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
        email: event.email.trim(),      
        budget: event.budget ? Number(event.budget) : null,
        services: selectedServices,
        status: "avoin",
        notes: event.notes || null,
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
   email: event.email.trim(),
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
<div
  style={{
    background: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  }}
>
  <h2
    style={{
      color: "#111827",
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    }}
  >
     Näin OmatJuhlat toimii
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
      gap: 20,
      textAlign: "center",
    }}
  >
    <div>
      <div style={{ fontSize: 40 }}>①</div>
      <div style={{ fontWeight: "bold", color: "#111827" }}>
        Täytä tiedot
      </div>
      <div style={{ color: "#6b7280", marginTop: 6 }}>
        Kerro juhlastasi.
      </div>
    </div>

    <div>
      <div style={{ fontSize: 40 }}>②</div>
      <div style={{ fontWeight: "bold", color: "#111827" }}>
        Saat tarjoukset
      </div>
      <div style={{ color: "#6b7280", marginTop: 6 }}>
        Palveluntarjoajat vastaavat.
      </div>
    </div>

    <div>
      <div style={{ fontSize: 40 }}>③</div>
      <div style={{ fontWeight: "bold", color: "#111827" }}>
        Vertaa
      </div>
      <div style={{ color: "#6b7280", marginTop: 6 }}>
        Valitse paras tarjous.
      </div>
    </div>

    <div>
      <div style={{ fontSize: 40 }}>④</div>
      <div style={{ fontWeight: "bold", color: "#111827" }}>
        Nauti juhlista
      </div>
      <div style={{ color: "#6b7280", marginTop: 6 }}>
        Kaikki on valmista. 🎉
      </div>
    </div>
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
<div
  style={{
    marginTop: 32,
    background: "#ffffff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
      gap: 20,
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 34 }}>🔒</div>

      <div
        style={{
          fontWeight: "bold",
          color: "#111827",
          marginTop: 10,
        }}
      >
        Turvallinen
      </div>

      <div
        style={{
          color: "#6b7280",
          marginTop: 8,
          lineHeight: 1.6,
        }}
      >
        Tietosi välitetään vain valituille palveluntarjoajille.
      </div>
    </div>

    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 34 }}>💚</div>

      <div
        style={{
          fontWeight: "bold",
          color: "#111827",
          marginTop: 10,
        }}
      >
        Maksuton
      </div>

      <div
        style={{
          color: "#6b7280",
          marginTop: 8,
          lineHeight: 1.6,
        }}
      >
        Tarjouspyynnön lähettäminen on täysin ilmaista.
      </div>
    </div>

    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 34 }}>⭐</div>

      <div
        style={{
          fontWeight: "bold",
          color: "#111827",
          marginTop: 10,
        }}
      >
        Ei sitoumuksia
      </div>

      <div
        style={{
          color: "#6b7280",
          marginTop: 8,
          lineHeight: 1.6,
        }}
      >
        Päätät itse hyväksytkö saamasi tarjoukset.
      </div>
    </div>
  </div>
</div>
<div
  style={{
    marginTop: 40,
    textAlign: "center",
    background: "#ffffff",
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  }}
>
  <h2
    style={{
      fontSize: 28,
      fontWeight: "bold",
      color: "#111827",
      marginBottom: 12,
    }}
  >
    🤝 Tarjoatko juhlapalveluita?
  </h2>

  <p
    style={{
      color: "#6b7280",
      marginBottom: 24,
    }}
  >
    Hae OmatJuhlat-kumppaniksi ja vastaanota tarjouspyyntöjä
    uusilta asiakkailta.
  </p>

  <a
    href="/partner/apply"
    style={{
      display: "inline-block",
      padding: "14px 28px",
      borderRadius: "999px",
      background: "#10b981",
      color: "#fff",
      textDecoration: "none",
      fontWeight: "bold",
    }}
  >
    🤝 Hae kumppaniksi
  </a>
</div>

      </div>
    </main>
  );
}