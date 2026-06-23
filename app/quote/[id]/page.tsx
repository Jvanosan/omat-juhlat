"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function QuotePage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id;

  const [offers, setOffers] = useState<any[]>([]);
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);
 const [quote, setQuote] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // tarjouspyynnön status
    const { data: quoteData } = await supabase
  .from("request_quotes")
  .select("date, location, guests, status")
  .eq("id", quoteId)
  .single();

setQuote(quoteData || null);
setQuoteStatus(quoteData?.status || null);

    // kaikki tarjoukset tähän tarjouspyyntöön
    const { data: qpData } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("quote_id", quoteId)
      .in("status", ["offered", "valittu"]);

    if (!qpData) return;

    // partnerit
    const { data: partners } = await supabase
      .from("partners")
      .select("*");

    const combined = qpData.map((q) => {
      const partner = partners?.find(
        (p) => String(p.id) === String(q.partner_id)
      );
      return {
        ...q,
        partner,
      };
    });

    setOffers(combined);
  }

  async function selectWinner(offer: any) {
    if (!confirm("Haluatko valita tämän tarjouksen?")) return;


    // 1️⃣ voittaja
    await supabase
      .from("quote_partners")
      .update({ status: "valittu" })
      .eq("id", offer.id);

    // 2️⃣ häviäjät (sama palvelu)
    await supabase
      .from("quote_partners")
      .update({ status: "hävitty" })
      .eq("quote_id", quoteId)
      .eq("service", offer.service)
      .neq("id", offer.id);

    alert("✅ Tarjous valittu");

    router.push(`/quote/${quoteId}/confirm`);
  }
  // ✅ Ryhmitellään tarjoukset palvelun mukaan
const offersByService = offers.reduce((acc: any, offer: any) => {
  const service = offer.service || "Muu palvelu";

  if (!acc[service]) {
    acc[service] = [];
  }

  acc[service].push(offer);
  return acc;
}, {});
return (
  <main
    style={{
      minHeight: "100vh",
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/juhlat.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      padding: 40,
    }}
  >
    {/* ✅ SISÄLLÖN KORTTI */}
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: 24,
        padding: 40,
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
      }}
    >
      {/* OTSIKKO */}
      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
         Saapuneet tarjoukset
      </h1>

      <p style={{ color: "#555", marginBottom: 24 }}>
        Vertaa tarjouksia rauhassa. Hinta ei ole ainoa asia – myös
        viesti ja fiilis ovat tärkeitä. Valitse yksi tarjous per
        palvelu.
      </p>

      {/* 🎨 TAPAHTUMAN YHTEENVETO – KUTSUKORTTI */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff, #f5f3ef)",
          padding: 32,
          borderRadius: 20,
          marginBottom: 40,
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: 16, fontSize: 22 }}>
          📋 Juhlan tiedot
        </h3>

        <div style={{ display: "grid", gap: 8, color: "#444" }}>
          {quote && (
            <>
              <p>
                📅 <strong>Päivämäärä:</strong> {quote.date}
              </p>
              <p>
                📍 <strong>Paikka:</strong> {quote.location}
              </p>
              <p>
                👥 <strong>Vierasmäärä:</strong> {quote.guests}
              </p>
            </>
          )}
        </div>

        <p
          style={{
            marginTop: 20,
            fontSize: 14,
            color: "#777",
          }}
        >
          Alla näet juhlaasi sopivat tarjoukset. Valitse rauhassa –
          vahvistat lopullisesti vasta seuraavassa vaiheessa.
        </p>
      </div>

      {quoteStatus === "confirmed" && (
        <div
          style={{
            background: "#e6f4ea",
            border: "1px solid #b7dfc2",
            padding: 16,
            borderRadius: 10,
            marginBottom: 24,
            fontWeight: "bold",
          }}
        >
          ✅ Tarjous on vahvistettu. Valintoja ei voi enää muuttaa.
        </div>
      )}

      {offers.length === 0 && <p>Ei vielä tarjouksia.</p>}

      {Object.entries(offersByService).map(
        ([service, serviceOffers]) => (
          <div key={service} style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 24,
                marginBottom: 24,
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: 8,
              }}
            >
              {service}
            </h2>

            {serviceOffers.map((o: any) => {
              const isSelected = o.status === "valittu";

              return (
                <div
  key={o.id}
  style={{
background: isSelected ? "#f0fdf4" : "#fff",    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    boxShadow: isSelected
      ? "0 16px 40px rgba(16,185,129,0.25)"
      : "0 10px 25px rgba(0,0,0,0.08)",
    border: isSelected
      ? "2px solid #10b981"
      : "1px solid #e5e7eb",
    transition: "all 0.2s ease",
    cursor: !isSelected ? "pointer" : "default",
  }}
  onMouseEnter={(e) => {
    if (!isSelected) {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow =
        "0 18px 40px rgba(0,0,0,0.18)";
    }
  }}
  onMouseLeave={(e) => {
    if (!isSelected) {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 10px 25px rgba(0,0,0,0.08)";
    }
  }}
>
                  <h3 style={{ marginBottom: 8 }}>
                    {o.partner?.company ||
                      "Palveluntarjoaja"}
                  </h3>

                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      marginBottom: 8,
                    }}
                  >
                    {o.offer_price} €
                  </div>

                  {o.offer_message && (
                    <p style={{ marginBottom: 16 }}>
                      “{o.offer_message}”
                    </p>
                  )}

{!isSelected && o.status === "offered" && o.offer_price && (
  <button
    onClick={() => selectWinner(o)}
    style={{
      width: "100%",
      padding: "12px 16px",
      borderRadius: 12,
      border: "none",
      background:
        "linear-gradient(90deg, #10b981, #34d399)",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    ✅ Valitse tämä tarjous
  </button>
)}
{(!o.offer_price || o.status !== "offered") && (
  <p
    style={{
      fontSize: 13,
      color: "#9ca3af",
      marginTop: 8,
      fontStyle: "italic",
    }}
  >
    Tämä palveluntarjoaja ei ole vielä antanut tarjousta.
  </p>
)}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  </main>
);
}