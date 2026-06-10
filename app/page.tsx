"use client";
import { useState } from "react";

/* ================= DATA ================= */

const services = [
  { id: "juhlatila", label: "Juhlatila" },
  { id: "catering", label: "Catering" },
  { id: "dj", label: "DJ / Musiikki" },
  { id: "valokuvaaja", label: "Valokuvaaja" },
  { id: "koristelu", label: "Koristelu" },
  { id: "kuljetus", label: "Kuljetus" },
];

const cities = [
  "Helsinki",
  "Espoo",
  "Vantaa",
  "Koko pääkaupunkiseutu",
  "Tampere",
  "Turku",
  "Oulu",
  "Koko Suomi",
];

/* ================= PAGE ================= */

export default function Page() {
  /* Date limit */
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  const minDateString = minDate.toISOString().split("T")[0];

  /* Quote form */
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    eventType: "",
    location: "",
    date: "",
    guests: "",
    services: [] as string[],
  });
  const [quoteDone, setQuoteDone] = useState(false);

  const toggleService = (id: string) => {
    setQuoteForm(p => ({
      ...p,
      services: p.services.includes(id)
        ? p.services.filter(s => s !== id)
        : [...p.services, id],
    }));
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quoteForm),
    });

    setQuoteDone(true);
  };

  return (
    <main style={{ fontFamily: "Arial, sans-serif", color: "#111" }}>

      {/* ================= NAV ================= */}
      <header style={{
        padding: "16px 40px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
      }}>
        <strong>OmatJuhlat</strong>
        <nav style={{ display: "flex", gap: 24 }}>
          <a href="#how">Miten toimii</a>
          <a href="#categories">Palvelut</a>
          <a href="#quote">Pyydä tarjous</a>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section style={{
        padding: "80px 40px",
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: 60,
        background: "#f7f7f7",
      }}>
        <div>
          <p style={{ color: "#666" }}>
            📍 Helsinki · Espoo · Vantaa · Koko Suomi
          </p>
          <h1 style={{ fontSize: 56, margin: "20px 0" }}>
            Juhlat ilman <span style={{ color: "#777" }}>stressiä</span>
          </h1>
          <p style={{ maxWidth: 520, color: "#444" }}>
            Täytä yksi lomake ja saat tarjoukset
            sopivilta juhlapalveluiden ammattilaisilta.
          </p>
          <a href="#quote"
             style={{
               display: "inline-block",
               marginTop: 24,
               padding: "14px 28px",
               background: "#111",
               color: "#fff",
               borderRadius: 6,
               textDecoration: "none",
               fontWeight: 600,
             }}>
            Pyydä tarjoukset
          </a>
        </div>

        <div style={{
          height: 280,
          background: "#eaeaea",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
        }}>
          (Tähän kuva juhlista)
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section id="categories" style={{ padding: "80px 40px" }}>
        <h2>Palvelukategoriat</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
          marginTop: 24,
        }}>
          {services.map(s => (
            <div key={s.id}
                 style={{
                   padding: 24,
                   border: "1px solid #eee",
                   borderRadius: 12,
                 }}>
              <strong>{s.label}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW ================= */}
      <section id="how" style={{ padding: "80px 40px", background: "#f7f7f7" }}>
        <h2>Miten se toimii?</h2>
        <ol>
          <li>Täytä lomake</li>
          <li>Saat tarjoukset</li>
          <li>Valitse paras</li>
        </ol>
      </section>

      {/* ================= QUOTE FORM ================= */}
      <section id="quote" style={{ padding: "80px 40px" }}>
        <h2>Pyydä tarjous</h2>

        {quoteDone ? (
          <p>✅ Tarjouspyyntö lähetetty! Tarkista sähköpostisi.</p>
        ) : (
          <form onSubmit={handleQuoteSubmit}
                style={{
                  maxWidth: 600,
                  marginTop: 24,
                }}>

            <input required placeholder="Nimi"
              value={quoteForm.name}
              onChange={e => setQuoteForm(p => ({ ...p, name: e.target.value }))}
              style={inputStyle} />

            <input required type="email" placeholder="Email"
              value={quoteForm.email}
              onChange={e => setQuoteForm(p => ({ ...p, email: e.target.value }))}
              style={inputStyle} />

            <input required placeholder="Tapahtumatyyppi (esim. Häät)"
              value={quoteForm.eventType}
              onChange={e => setQuoteForm(p => ({ ...p, eventType: e.target.value }))}
              style={inputStyle} />

            <select required
              value={quoteForm.location}
              onChange={e => setQuoteForm(p => ({ ...p, location: e.target.value }))}
              style={inputStyle}>
              <option value="">Paikkakunta</option>
{cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <input
              required
              type="date"
              min={minDateString}
              value={quoteForm.date}
              onChange={e =>
                setQuoteForm(p => ({ ...p, date: e.target.value }))
              }
              style={inputStyle}
            />

            <input
              required
              type="number"
              placeholder="Vierasmäärä"
              value={quoteForm.guests}
              onChange={e =>
                setQuoteForm(p => ({ ...p, guests: e.target.value }))
              }
              style={inputStyle}
            />

            <p>Palvelut:</p>
            {services.map(s => (
              <label key={s.id} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={quoteForm.services.includes(s.id)}
                  onChange={() => toggleService(s.id)}
                />{" "}
                {s.label}
              </label>
            ))}

            <button
              type="submit"
              style={{
                marginTop: 20,
                padding: "14px",
                width: "100%",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 700,
              }}
            >
              Lähetä tarjouspyyntö
            </button>
          </form>
        )}
      </section>

      {/* ================= PARTNER-OSIO ================= */}
      <section id="partner" style={{ padding: "80px 40px", background: "#fff" }}>
        <h2>Liity kumppaniksi</h2>
        <p>
          Saat uusia asiakkaita ilman omaa markkinointia.
        </p>
        <a
          href="/login"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "12px 24px",
            background: "#111",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Kirjaudu / hae kumppaniksi
        </a>
      </section>

      <footer style={{ padding: 40, borderTop: "1px solid #eee" }}>
        © OmatJuhlat
      </footer>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
};

{/* ================= FAQ ================= */}
<section
  id="faq"
  style={{
    padding: "100px 40px",
    background: "#f7f7f7",
  }}
>
  <div style={{ maxWidth: 900, margin: "0 auto" }}>
    <h2 style={{ fontSize: 36, marginBottom: 40 }}>
      Usein kysytyt kysymykset
    </h2>

    {[
      {
        q: "Onko palvelun käyttö asiakkaalle ilmaista?",
        a: "Kyllä. Tarjouspyynnön tekeminen ja tarjousten vastaanottaminen on täysin ilmaista asiakkaalle.",
      },
      {
        q: "Kuinka nopeasti saan tarjoukset?",
        a: "Yleensä saat tarjoukset sähköpostiisi 24 tunnin sisällä tarjouspyynnön lähettämisestä.",
      },
      {
        q: "Miten kumppanit valitaan?",
        a: "Kaikki kumppanit tarkistetaan ennen hyväksyntää. Välitämme tarjouspyynnöt vain sopiville toimijoille.",
      },
      {
        q: "Voinko pyytää tarjouksen useasta palvelusta kerralla?",
        a: "Kyllä. Yhdellä lomakkeella voit pyytää tarjouksia useista palveluista samanaikaisesti.",
      },
      {
        q: "Sitoudunko mihinkään pyytäessäni tarjouksen?",
        a: "Et. Tarjouspyyntö on täysin sitoumukseton.",
      },
    ].map((item, i) => (
      <div
        key={i}
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <strong style={{ display: "block", marginBottom: 8 }}>
          {item.q}
        </strong>
        <p style={{ color: "#555", margin: 0 }}>{item.a}</p>
      </div>
    ))}
  </div>
</section>

{/* ================= FOOTER ================= */}
<footer
  style={{
    padding: "60px 40px",
    borderTop: "1px solid #eee",
    background: "#ffffff",
  }}
>
  <div
    style={{
      maxWidth: 1200,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: 40,
    }}
  >
    <div>
      <strong style={{ fontSize: 20 }}>OmatJuhlat</strong>
      <p style={{ color: "#555", marginTop: 12, maxWidth: 320 }}>
        Suomen juhlapalveluiden markkinapaikka.
        Löydä kaikki juhliin tarvittava yhdestä paikasta.
      </p>
    </div>

    <div>
      <strong>Palvelut</strong>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {services.map(s => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            {s.label}
          </li>
        ))}
      </ul>
    </div>

    <div>
      <strong>Yritys</strong>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        <li style={{ marginBottom: 8 }}>
          <a href="#partner">Liity kumppaniksi</a>
        </li>
        <li style={{ marginBottom: 8 }}>
          <a href="#faq">UKK</a>
        </li>
        <li style={{ marginBottom: 8 }}>
          <a href="/login">Kirjaudu</a>
        </li>
      </ul>
    </div>
  </div>

  <div
    style={{
      marginTop: 40,
      paddingTop: 20,
      borderTop: "1px solid #eee",
      textAlign: "center",
      fontSize: 13,
      color: "#777",
    }}
  >
    © {new Date().getFullYear()} OmatJuhlat. Kaikki oikeudet pidätetään.
  </div>
</footer>