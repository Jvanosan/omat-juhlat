"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PartnerPage() {
  const [items, setItems] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
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
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "linear-gradient(180deg, #f9fafb, #eef2f3)",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
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
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          {/* TILA */}
          {item.status === "peruttu" && (
            <p style={{ color: "#991b1b", fontWeight: "bold" }}>
              ❌ Tarjous peruttu
            </p>
          )}

          {item.status === "valittu" && (
            <p style={{ color: "#047857", fontWeight: "bold" }}>
              🏆 Asiakas valitsi tämän tarjouksen
            </p>
          )}

          {item.status === "hävitty" && (
            <p style={{ color: "#991b1b", fontWeight: "bold" }}>
              ❌ Asiakas valitsi toisen tarjouksen
            </p>
          )}

          {item.status === "offered" && !item.offer_price && (
            <p style={{ color: "#92400e", fontWeight: "bold" }}>
              🕒 Odottaa vastaustasi
            </p>
          )}

          {item.status === "offered" && item.offer_price && (
            <p style={{ color: "#047857", fontWeight: "bold" }}>
              ✅ Tarjous lähetetty – odottaa asiakkaan päätöstä
            </p>
          )}

          <h3 style={{ marginBottom: 8 }}>
            📦 Palvelu: {item.service}
          </h3>

          <p style={{ color: "#555" }}>
            📅 {item.quote?.date} <br />
            📍 {item.quote?.location} <br />
            👥 {item.quote?.guests} vierasta
          </p>

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
                  padding: 10,
                  marginBottom: 8,
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
                  padding: 10,
                  marginBottom: 12,
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
                padding: 12,
                borderRadius: 8,
                color: "#065f46",
                marginTop: 10,
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
  );
}