"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageContainer from "@/app/components/PageContainer";

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
    const { data: quoteData } = await supabase
      .from("request_quotes")
      .select("date, location, guests, status")
      .eq("id", quoteId)
      .single();

    setQuote(quoteData || null);
    setQuoteStatus(quoteData?.status || null);

    const { data: qpData } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("quote_id", quoteId)
      .in("status", ["offered", "valittu"]);

    if (!qpData) return;

    const { data: partners } = await supabase
      .from("partners")
      .select("id, company, images");

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

    await supabase
      .from("quote_partners")
      .update({ status: "valittu" })
      .eq("id", offer.id);

    await supabase
      .from("quote_partners")
      .update({ status: "hävitty" })
      .eq("quote_id", quoteId)
      .eq("service", offer.service)
      .neq("id", offer.id);

    alert("✅ Tarjous valittu");

    router.push(`/quote/${quoteId}/confirm`);
  }

  const offersByService = offers.reduce((acc: any, offer: any) => {
    const service = offer.service || "Muu palvelu";
    if (!acc[service]) acc[service] = [];
    acc[service].push(offer);
    return acc;
  }, {});
  return (
      <PageContainer>
    <main
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/juhlat.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 16,
      }}
    >
      <div
  style={{
    maxWidth: 900,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 24,
    padding: 20,
  }}
>
<h1
  style={{
    fontSize: 32,
    marginBottom: 16,
    fontWeight: "bold",
    wordBreak: "break-word",
  }}
>
            🎉 Saapuneet tarjoukset
        </h1>
<p
  style={{
    color: "#666",
    marginBottom: 20,
    fontSize: 18,
    lineHeight: 1.6,
  }}
>  Vertaa tarjouksia ja valitse paras vaihtoehto palvelulle.
</p>

        {quote && (
  <div
    style={{
      background: "#f5f3ef",
      padding: 20,
      borderRadius: 16,
      marginBottom: 30,
    }}
  >
<h3
  style={{
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
  }}
>
  📋 Juhlan tiedot
</h3>
    <p style={{ fontSize: 18 }}>📅 {quote.date}</p>
<p style={{ fontSize: 18 }}>📍 {quote.location}</p>
<p style={{ fontSize: 18 }}>👥 {quote.guests} vierasta</p>

  </div>
)}
{quoteStatus === "confirmed" && (
  <div
    style={{
      background: "#dcfce7",
      padding: 14,
      borderRadius: 10,
      marginBottom: 20,
      fontWeight: "bold",
    }}
  >
      ✅ Tarjous on jo vahvistettu
  </div>
)}
{offers.length === 0 && <p>Ei vielä tarjouksia.</p>}
        {Object.entries(offersByService).map(([service, list]: any) => (
          <div key={service} style={{ marginBottom: 40 }}>
<h2
  style={{
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
  }}
>
              {service}</h2>

            {list.map((o: any) => {
              const isSelected = o.status === "valittu";

              return (
                <div
                  key={o.id}
                  style={{
                    background: isSelected ? "#ecfdf5" : "#fff",
                    borderRadius: 18,
                    padding: 24,
                    marginBottom: 20,
                    border: isSelected
                      ? "2px solid #10b981"
                      : "1px solid #e5e7eb",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* ✅ BADGE */}
                  {isSelected && (
                    <div
                      style={{
                        background: "#10b981",
                        color: "#fff",
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 999,
                        marginBottom: 10,
                        fontSize: 12,
                      }}
                    >
                      ✅ Valittu
                    </div>
                  )}

                  {/* ✅ KUVAT */}
                  {o.partner?.images && (
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        overflowX: "auto",
                        marginBottom: 12,
                      }}
                    >
                      {o.partner.images
                        .split(",")
                        .map((img: string, i: number) => (
                          <img
                            key={i}
                            src={img.trim()}
                            style={{
                              height: 80,
                              width: 120,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                          />
                        ))}
                    </div>
                  )}

                  {/* ✅ TEKSTI */}
                  <div style={{ paddingTop: 6 }}>
<h3
  style={{
    marginBottom: 8,
    fontSize: 22,
    fontWeight: "bold",
    wordBreak: "break-word",
  }}
>
  {o.partner?.company}
</h3>

                    <div
  style={{
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    wordBreak: "break-word",
  }}
>
💰 {o.offer_price} €
                    </div>

                    {o.offer_message && (
<p
  style={{
    marginBottom: 16,
    fontSize: 17,
    lineHeight: 1.6,
  }}
>                        “{o.offer_message}”
                      </p>
                    )}

                    {!isSelected &&
                      o.status === "offered" &&
                      o.offer_price && (
                        <button
                          onClick={() => selectWinner(o)}
                          style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: 10,
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          ✅ Valitse tarjous
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
      </PageContainer>
  );
}