"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ✅ SERVICES CLEANING (KEEP SAME LOGIC) */
function cleanAndNormalizeServices(raw: any): string[] {
  if (!raw) return [];

  let str = Array.isArray(raw) ? raw.join(",") : String(raw);

  str = str
    .replace(/[\[\]\(\)"']/g, "")
    .replace(/&amp;/g, ",")
    .replace(/\//g, ",");

  const parts = str
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const map: Record<string, string> = {
    juhlatila: "Juhlatila",
    catering: "Catering",
    dj: "DJ / Musiikki",
    musiikki: "DJ / Musiikki",
    valokuvaus: "Valokuvaus",
    somistus: "Somistus / Koristelu",
  };

  return Array.from(
    new Set(parts.map((p) => map[p] || p.charAt(0).toUpperCase() + p.slice(1)))
  );
}

export default function BrowsePage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  const [areaFilter, setAreaFilter] = useState("Kaikki");
  const [serviceFilter, setServiceFilter] = useState("Kaikki");

  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ✅ FETCH PARTNERS */
  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from("partners")
        .select("id, company, area, services")
        .eq("status", "approved");

      setPartners(data || []);
    };

    fetchPartners();
  }, []);

  /* ✅ FILTER DATA */
  const areas = [
    "Kaikki",
    ...Array.from(new Set(partners.map((p) => p.area))).filter(Boolean),
  ];

  const services = [
    "Kaikki",
    ...Array.from(
      new Set(
        partners.flatMap((p) =>
          cleanAndNormalizeServices(p.services)
        )
      )
    ),
  ];

  const filteredPartners = partners.filter((p) => {
    const services = cleanAndNormalizeServices(p.services);

    const serviceMatch =
      serviceFilter === "Kaikki" ||
      services.includes(serviceFilter);

    const areaMatch =
      areaFilter === "Kaikki" ||
      p.area === areaFilter;

    return serviceMatch && areaMatch;
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: 40,
          }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            ✨ Selaa palveluntarjoajia
          </h1>

          <p style={{ color: "#374151", marginTop: 8 }}>
            Valitse palvelut ja ota suoraan yhteyttä.
          </p>
        </div>

        {/* FILTERS (PART 2 CONTINUES BELOW...) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {/* AREA FILTER */}
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontWeight: 600, color: "#374151" }}>
              📍 Alue
            </label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                backgroundColor: "#fff",
                color: "#111827",
              }}
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* SERVICE FILTER */}
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontWeight: 600, color: "#374151" }}>
              🛠️ Palvelu
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                backgroundColor: "#fff",
                color: "#111827",
              }}
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PARTNER GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {filteredPartners.map((company) => {
            const checked = selectedPartners.includes(company.id);

            return (
              <div
                key={company.id}
                onClick={() => {
                  setSelectedPartners((prev) =>
                    checked
                      ? prev.filter((id) => id !== company.id)
                      : [...prev, company.id]
                  );
                }}
                style={{
                  cursor: "pointer",
                  borderRadius: 16,
                  padding: 20,
                  background: "#ffffff",
                  border: checked
                    ? "2px solid #10b981"
                    : "1px solid #e5e7eb",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                }}
              >
                {/* COMPANY NAME */}
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  {checked ? "✅ " : ""}
                  {company.company}
                </div>

                {/* AREA */}
                <div style={{ color: "#6b7280", fontSize: 14 }}>
                  📍 {company.area}
                </div>

                {/* SERVICES */}
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {cleanAndNormalizeServices(company.services).map(
                    (s: string) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 12,
                          padding: "4px 8px",
                          borderRadius: 8,
                          background: "#f1f5f9",
                          color: "#374151",
                        }}
                      >
                        {s}
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
                {/* REQUEST FORM */}
        <div
          style={{
            marginTop: 60,
            background: "#ffffff",
            padding: 30,
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            maxWidth: 600,
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
              color: "#111827",
            }}
          >
            📩 Lähetä tarjouspyyntö
          </h2>

          {success ? (
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #10b981",
                padding: 20,
                borderRadius: 12,
                fontWeight: "bold",
                color: "#065f46",
              }}
            >
              ✅ Tarjouspyyntö lähetetty!
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {/* EMAIL */}
              <input
                type="email"
                placeholder="Sähköposti"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 16,
                  color: "#111827",
                }}
              />

              {/* DATE */}
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 16,
                  color: "#111827",
                }}
              />

              {/* GUESTS */}
              <input
                type="number"
                placeholder="Vierasmäärä"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 16,
                  color: "#111827",
                }}
              />

              {/* BUTTON */}
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

                  const { error } = await supabase
                    .from("direct_requests")
                    .insert({
                      email,
                      event_date: eventDate,
                      guests: Number(guests),
                      partner_ids: selectedPartners,
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
                    alert(error.message);
                  }

                  setSending(false);
                  setSuccess(true);
                }}
                style={{
                  marginTop: 10,
                  padding: "14px",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 16,
                  fontWeight: "bold",
                  background: sending
                    ? "#9ca3af"
                    : "#2563eb",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {sending ? "Lähetetään..." : "📩 Lähetä pyyntö"}
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}