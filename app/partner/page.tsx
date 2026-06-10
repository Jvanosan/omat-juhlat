"use client";
import { useState } from "react";

export default function PartnerPage() {
  const [form, setForm] = useState({
    company: "",
    email: "",
    area: "",
    max_guests: "",
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/partner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <main style={{ padding: 40, maxWidth: 600 }}>
        <h1>✅ Hakemus lähetetty</h1>
        <p>
          Kiitos hakemuksesta! Tarkistamme tiedot ja otamme sinuun
          yhteyttä sähköpostitse.
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, maxWidth: 600 }}>
      <h1>🤝 Hae OmatJuhlat‑kumppaniksi</h1>
      <p style={{ marginBottom: 24 }}>
        Täytä lomake ja hae mukaan OmatJuhlat‑verkostoon.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          required
          placeholder="Yrityksen nimi"
          value={form.company}
          onChange={e =>
            setForm(p => ({ ...p, company: e.target.value }))
          }
          style={inputStyle}
        />

        <input
          required
          type="email"
          placeholder="Sähköposti"
          value={form.email}
          onChange={e =>
            setForm(p => ({ ...p, email: e.target.value }))
          }
          style={inputStyle}
        />

        <input
          required
          placeholder="Toiminta‑alue (esim. Helsinki)"
          value={form.area}
          onChange={e =>
            setForm(p => ({ ...p, area: e.target.value }))
          }
          style={inputStyle}
        />

        <input
          required
          type="number"
          placeholder="Maksimi vierasmäärä"
          value={form.max_guests}
          onChange={e =>
            setForm(p => ({ ...p, max_guests: e.target.value }))
          }
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Lähetetään..." : "Lähetä hakemus"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 700,
  cursor: "pointer",
};
