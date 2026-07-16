"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageContainer from "../components/PageContainer"

export default function PartnerPage() {
  const router = useRouter();
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

    if (!user?.email) {
  router.push("/partner/login");
  return;
}

    const { data: partner } = await supabase
      .from("partners")
      .select("*")
      .eq("email", user.email)
      .single();

if (!partner) {
  router.push("/partner/login");
  return;
}
    const { data: qp } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("partner_id", partner.id);

    if (!qp || qp.length === 0) {
      setItems([]);
      return;
    }

    const validQuotePartners = qp.filter(
  (q) => q.quote_id !== null && q.quote_id !== undefined
);

const quoteIds = Array.from(
  new Set(validQuotePartners.map((q) => q.quote_id))
);

    const { data: quotes, error: quotesError } = await supabase
  .from("request_quotes")
  .select("*")
  .in("id", quoteIds);

console.log("PARTNER QUOTE IDS:", quoteIds);
console.log("PARTNER QUOTES:", quotes);
console.log("PARTNER QUOTES ERROR:", quotesError);

const combined = validQuotePartners.map((q) => {
  const quote = quotes?.find(
  (r) => String(r.id) === String(q.quote_id)
);      
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
.update({ status: "cancelled" })
      .eq("id", item.id);

    alert("Tarjous peruttu");
    loadData();
  }
async function handleLogout() {
  await supabase.auth.signOut();
  router.push("/partner/login");
}
  return (
    <PageContainer>
    <main
  style={{
    minHeight: "100vh",
    padding: 16,
    background: "linear-gradient(180deg, #f3f4f6, #e5e7eb)",
  }}
>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
    flexWrap: "wrap",
  }}
>
  <h1
    style={{
      fontSize: 32,
      fontWeight: "bold",
      color: "#111827",
      margin: 0,
    }}
  >
    📥 Saapuneet tarjouspyynnöt
  </h1>

  <button
    onClick={handleLogout}
    style={{
      background: "#ef4444",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Kirjaudu ulos
  </button>
</div>

      {items.length === 0 && (
<p
  style={{
    color: "#111827",
    fontSize: 17,
    lineHeight: 1.6,
  }}
>
  Ei avoimia tarjouspyyntöjä tällä hetkellä.
</p>      )}

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
{(item.status === "cancelled" ||
  item.status === "peruttu") && (
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

          {(item.status === "selected" ||
  item.status === "valittu") && (
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
          {(item.status === "rejected" ||
  item.status === "hävitty") && (
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

{item.status === "sent" && !item.offer_price && (            <p style={{ color: "#92400e", fontWeight: "bold" }}>
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
    marginBottom: 10,
    fontSize: 22,
    fontWeight: 700,
    wordBreak: "break-word",
    color: "#111827",
    lineHeight: 1.4,
  }}
>
        📦 Palvelu: {item.service}
          </h3>

<p
  style={{
    color: "#111827",
    fontSize: 17,
    fontWeight: 500,
    lineHeight: 1.8,
  }}
>          📅 {item.quote?.date} <br />
            📍 {item.quote?.location} <br />
            👥 {item.quote?.guests} vierasta
          </p>
          {item.quote?.extraInfo && (
<div
  style={{
    marginTop: 12,
    padding: 14,
    background: "#f9fafb",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    color: "#111827",
    lineHeight: 1.7,
  }}
>
<strong
  style={{
    color: "#111827",
    fontSize: 16,
  }}
>
  Lisätiedot:
</strong>    <br />
    {item.quote.extraInfo}
  </div>
)}

{!item.offer_price && item.status === "sent" ? (            <>
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
  color: "#111827",
  background: "#ffffff",
  WebkitTextFillColor: "#111827",
  caretColor: "#111827",
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
  color: "#111827",
  background: "#ffffff",
  WebkitTextFillColor: "#111827",
  caretColor: "#111827",
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
  color: "#111827",
  marginTop: 12,
  border: "1px solid #a7f3d0",
  lineHeight: 1.7,
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