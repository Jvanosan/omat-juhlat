"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageContainer from "../components/PageContainer"

export default function PartnerPage() {
  const [items, setItems] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
  loadData();

  const interval = setInterval(() => {
    loadData();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return;

    const { data: partner } = await supabase
      .from("partners")
      .select("*")
      .eq("email", user.email)
      .single();

    if (!partner) return;

    const { data: qp } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("partner_id", partner.id);

    if (!qp || qp.length === 0) {
      setItems([]);
      return;
    }

    const quoteIds = qp.map((q) => q.quote_id);

    const { data: quotes } = await supabase
      .from("request_quotes")
      .select("*")
      .in("id", quoteIds);

    const combined = qp.map((q) => {
      const quote = quotes?.find((r) => r.id === q.quote_id);
      return {
        ...q,
        quote,
      };
    });

    setItems(combined);
  }
  
  async function submitOffer(item: any) {
  const price = prices[item.id];
  const message = messages[item.id];

  if (!price) {
    alert("Anna hinta ennen lähettämistä");
    return;
  }

  const { error } = await supabase
    .from("quote_partners")
    .update({
      offer_price: Number(price),
      offer_message: message || "",
      status: "offered",
    })
    .eq("id", item.id);

  if (error) {
    console.error("UPDATE ERROR:", error);
    alert("Virhe tallennuksessa: " + error.message);
    return;
  }

  alert("✅ Tarjous lähetetty");
  loadData();
}

  async function cancelOffer(item: any) {
    if (!confirm("Haluatko varmasti perua tämän tarjouksen?")) return;

    await supabase
      .from("quote_partners")
      .update({ status: "peruttu" })
      .eq("id", item.id);

    alert("Tarjous peruttu");
    loadData();
  }

  return (
    <PageContainer>
    <main
  style={{
    minHeight: "100vh",
    padding: 16,
    background: "linear-gradient(180deg, #f9fafb, #eef2f3)",
  }}
>
<h1
  style={{
    fontSize: 32,
    marginBottom: 24,
    fontWeight: "bold",
    wordBreak: "break-word",
  }}
>     
📥 Saapuneet tarjouspyynnöt
      </h1>

      {items.length === 0 && (
        <p>Ei avoimia tarjouspyyntöjä tällä hetkellä.</p>
      )}

      {items.map((item) => (
        <div
  key={item.id}
  style={{
    background: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  }}
>
          {/* TILA */}
          {item.status === "peruttu" && (
  <div
    style={{
      background: "#fee2e2",
      color: "#991b1b",
      padding: "10px 14px",
      borderRadius: 10,
      marginBottom: 12,
      fontWeight: "bold",
      display: "inline-block",
    }}
  >
    ❌ Tarjous peruttu
  </div>
)}

          {item.status === "valittu" && (
  <div
    style={{
      background: "#dcfce7",
      color: "#166534",
      padding: "14px",
      borderRadius: 10,
      marginBottom: 12,
      border: "1px solid #86efac",
    }}
  >
    <div style={{ fontWeight: "bold", marginBottom: 10 }}>
      🏆 Asiakas valitsi tämän tarjouksen
    </div>

    <div>👤 {item.quote?.name}</div>
    <div>📧 {item.quote?.email}</div>
    <div>📞 {item.quote?.phone}</div>

    {item.quote?.extraInfo && (
      <div style={{ marginTop: 10 }}>
        💬 {item.quote.extraInfo}
      </div>
    )}
  </div>
)}

          {item.status === "hävitty" && (
  <div
    style={{
      background: "#fee2e2",
      color: "#991b1b",
      padding: "10px 14px",
      borderRadius: 10,
      marginBottom: 12,
      fontWeight: "bold",
      display: "inline-block",
    }}
  >
    ❌ Asiakas valitsi toisen tarjouksen
  </div>
)}

          {item.status === "offered" && !item.offer_price && (
            <p style={{ color: "#92400e", fontWeight: "bold" }}>
              🕒 Odottaa vastaustasi
            </p>
          )}
{item.status === "offered" && item.offer_price && (
  <div
    style={{
      background: "#dcfce7",
      color: "#166534",
      padding: "10px 14px",
      borderRadius: 10,
      marginBottom: 12,
      fontWeight: "bold",
      display: "inline-block",
    }}
  >
    ✅ Tarjous lähetetty – odottaa asiakkaan päätöstä
  </div>
)}
<h3
  style={{
    marginBottom: 8,
    fontSize: 22,
    fontWeight: 700,
    wordBreak: "break-word",
  }}
>         📦 Palvelu: {item.service}
          </h3>

<p
  style={{
    color: "#555",
    fontSize: 16,
    lineHeight: 1.6,
  }}
>            📅 {item.quote?.date} <br />
            📍 {item.quote?.location} <br />
            👥 {item.quote?.guests} vierasta
          </p>
          {item.quote?.extraInfo && (
  <div
    style={{
      marginTop: 12,
      padding: 12,
      background: "#f9fafb",
      borderRadius: 10,
      border: "1px solid #e5e7eb",
    }}
  >
    <strong>Lisätiedot:</strong>
    <br />
    {item.quote.extraInfo}
  </div>
)}

          {!item.offer_price && item.status === "offered" ? (
            <>
              <input
  type="number"
  placeholder="Hinta (€)"
  value={prices[item.id] || ""}
  onChange={(e) =>
    setPrices({ ...prices, [item.id]: e.target.value })
  }
  style={{
    width: "100%",
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 16,
    boxSizing: "border-box",
  }}
/>

              <textarea
                placeholder="Viesti asiakkaalle (valinnainen)"
                value={messages[item.id] || ""}
                onChange={(e) =>
                  setMessages({ ...messages, [item.id]: e.target.value })
                }
                style={{
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 16,
  boxSizing: "border-box",
}}
              />

              <button
                onClick={() => submitOffer(item)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "none",
                  background:
                    "linear-gradient(90deg, #10b981, #34d399)",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                💰 Lähetä tarjous
              </button>
            </>
          ) : item.offer_price ? (
            <div
  style={{
    background: "#ecfdf5",
    padding: 16,
    borderRadius: 12,
    color: "#065f46",
    marginTop: 12,
    border: "1px solid #a7f3d0",
  }}
>
              <p><strong>Lähettämäsi tarjous:</strong></p>
              <p>💰 {item.offer_price} €</p>
              {item.offer_message && <p>💬 {item.offer_message}</p>}

              {item.status === "offered" && (
                <button
                  onClick={() => cancelOffer(item)}
                  style={{
                    marginTop: 8,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ❌ Peru tarjous
                </button>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </main>
  </PageContainer>
);
}