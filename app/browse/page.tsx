"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
// ✅ LOPULLINEN palveluiden puhdistus + normalisointi
function cleanAndNormalizeServices(raw: any): string[] {
  if (!raw) return [];

  // 1️⃣ Muutetaan kaikki stringiksi
  let str = Array.isArray(raw) ? raw.join(",") : String(raw);

  // 2️⃣ Poistetaan erikoismerkit
  str = str
    .replace(/[\[\]\(\)"']/g, "") // poista [] () "" '
    .replace(/&/g, ",")            // & → ,
    .replace(/\//g, ",");          // / → ,

  // 3️⃣ Pilkotaan yksittäisiksi palveluiksi
  const parts = str
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // 4️⃣ Normalisointi virallisiin nimiin
  const map: Record<string, string> = {
    // Juhlatila
    "juhlatila": "Juhlatila",
    "juhla tila": "Juhlatila",
    "juhla-tila": "Juhlatila",
    "juhlatilat": "Juhlatila",

    // Catering
    "catering": "Catering",
    "ravintola": "Catering",
    "ruokailu": "Catering",

    // DJ / Musiikki
    "dj": "DJ / Musiikki",
    "musiikki": "DJ / Musiikki",
    "dj musiikki": "DJ / Musiikki",
    "dj & musiikki": "DJ / Musiikki",
    "dj / musiikki": "DJ / Musiikki",

    // Valokuvaus
    "valokuvaaja": "Valokuvaus",
    "valokuvaus": "Valokuvaus",
    "kuvaaja": "Valokuvaus",

    // Somistus
    "somistus": "Somistus / Koristelu",
    "koristelu": "Somistus / Koristelu",

    // Muut
    "event planner": "Tapahtumasuunnittelu",
    "leipomo": "Leipomo / Kakut",
    "kakut": "Leipomo / Kakut",
    "leipomo kakut": "Leipomo / Kakut",
  };

  return Array.from(
    new Set(parts.map((p) => map[p] || p.charAt(0).toUpperCase() + p.slice(1)))
  );
}

export default function BrowsePage() {
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const [partners, setPartners] = useState<any[]>([]);
  
  const [areaFilter, setAreaFilter] = useState("Kaikki");
const [serviceFilter, setServiceFilter] = useState("Kaikki");

  // ✅ HAETAAN PARTNERIT AUTOMAATTISESTI
  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
  .from("partners")
  .select("id, company, area, services")
  .eq("status", "approved");

if (error) {
  console.error("SUPABASE PARTNERS ERROR:", error);
}

console.log("PARTNERS DATA:", data);

setPartners(data || []);
    };

    fetchPartners();
  }, []);


  const areas = [
  "Kaikki",
  ...Array.from(new Set(partners.map((p) => p.area))).filter(Boolean),
];
const services = [
  "Kaikki",
  ...Array.from(
    new Set(
      partners.flatMap((p) => cleanAndNormalizeServices(p.services))
    )
  ),
];
const groupedPartners = partners.reduce((acc: any, company: any) => {
  const services = cleanAndNormalizeServices(company.services);

  services.forEach((service) => {
    if (serviceFilter !== "Kaikki" && service !== serviceFilter) return;
    if (areaFilter !== "Kaikki" && company.area !== areaFilter) return;

    if (!acc[service]) acc[service] = {};
    if (!acc[service][company.area]) acc[service][company.area] = [];

    acc[service][company.area].push(company);
  });

  return acc;
}, {});
return (
    <main
  style={{
    minHeight: "100vh",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/juhlat.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    padding: 40,
  }}
>
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "rgba(255,255,255,0.95)",
          color: "#111",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
           
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>
          ✨ Ota yhteyttä suoraan palveluntarjoajaan
        </h1>

         <p style={{ color: "#1f2937", marginBottom: 32 }}>
          Valitse itse ne palveluntarjoajat, joihin haluat olla yhteydessä.
          Tämä tarjouspyyntö lähetetään vain valituille yrityksille – ei kaikille.
        </p>

        <div
  style={{
    display: "flex",
    gap: 16,
    marginBottom: 32,
    flexWrap: "wrap",
  }}
>
   <select
  value={areaFilter}
  onChange={(e) => setAreaFilter(e.target.value)}
style={{
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  color: "#111",
  backgroundColor: "#fff"
}}
>
  {areas.map((area) => (
    <option key={area} value={area}>
      {area}
    </option>
  ))}
</select>

  <select
    value={serviceFilter}
    onChange={(e) => setServiceFilter(e.target.value)}
    style={{ padding: 8, borderRadius: 8 }}
  >
    {services.map((service) => (
      <option key={service} value={service}>
        {service}
      </option>
    ))}
  </select>
</div>
        {/* ✅ YRITYSLISTA */}
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>
          Valitse palveluntarjoajat
        </h2>

        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
        {Object.entries(groupedPartners).map(([service, areas]: any) => (
  <div key={service} style={{ marginBottom: 40 }}>
    <h2 style={{ fontSize: 26, marginBottom: 16 }}>
      {service}
    </h2>

    {Object.entries(areas).map(([area, companies]: any) => (
      <div key={area} style={{ marginBottom: 24, paddingLeft: 12 }}>
        <h3 style={{ fontSize: 18, marginBottom: 8, color: "#111" }}>
  {area}
</h3>

        <div style={{ display: "grid", gap: 12 }}>
          {companies.map((company: any) => {
            const checked = selectedPartners.includes(company.id);

            return (
              <label
                key={company.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 16,
                  borderRadius: 12,
                  border: checked
                    ? "2px solid #10b981"
                    : "1px solid #e5e7eb",
                  background: checked ? "#ecfdf5" : "#fff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setSelectedPartners((prev) =>
                      checked
                        ? prev.filter((id) => id !== company.id)
                        : [...prev, company.id]
                    );
                  }}
                />
<span style={{ color: "#111", fontWeight: "500" }}>
  {company.company}
</span>
              </label>
            );
          })}
        </div>
      </div>
    ))}
  </div>
))}
        </div>

        {/* ✅ LOMAKE */}
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>
          Lähetä tarjouspyyntö
        </h2>

        {success ? (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #10b981",
              padding: 20,
              borderRadius: 12,
              fontWeight: "bold",
            }}
          >
            ✅ Tarjouspyyntö lähetetty valituille palveluntarjoajille.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12, maxWidth: 400 }}>
            <input
  type="email"
  placeholder="Sähköpostiosoite"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={{
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    color: "#111"
  }}
/>


            <input
  type="date"
  value={eventDate}
  onChange={(e) => setEventDate(e.target.value)}
  style={{
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    color: "#111"
  }}
/>

            <input
  type="number"
  placeholder="Arvioitu vierasmäärä"
  value={guests}
  onChange={(e) => setGuests(e.target.value)}
  style={{
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    color: "#111"
  }}
/>

            <button
              disabled={sending}
              onClick={async () => {
                if (
                  !email ||
                  !eventDate ||
                  !guests ||
                  selectedPartners.length === 0
                ) {
                  alert(
                    "Täytä kaikki kentät ja valitse vähintään yksi yritys."
                  );
                  return;
                }

                setSending(true);

                const { error } = 
                await supabase.from("direct_requests").insert({
  email,
  event_date: eventDate,
  guests: Number(guests),
  partner_ids: selectedPartners.map((id) => id), // ✅ varmistetaan uuid[]
});
await fetch("/api/send-direct-request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email,
    event_date: eventDate,
    guests,
    partner_ids: selectedPartners,
  }),
});

if (error) {
  console.error("DIRECT_REQUESTS INSERT ERROR:", error);
  alert(error.message);
}

                setSending(false);
                setSuccess(true);
              }}
              style={{
                marginTop: 12,
                padding: "12px 16px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(90deg, #10b981, #34d399)",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              📩 Lähetä tarjouspyyntö
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
