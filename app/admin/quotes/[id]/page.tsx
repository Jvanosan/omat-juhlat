"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function QuoteDetailPage() {
  const params = useParams();
  const quoteId = Number(params.id);

  const [partners, setPartners] = useState<any[]>([]);
  const [quotePartners, setQuotePartners] = useState<any[]>([]);
  const [service, setService] = useState("");

  useEffect(() => {
    fetchPartners();
    fetchQuotePartners();
  }, []);

  async function fetchPartners() {
    const { data } = await supabase.from("partners").select("*");
    if (data) setPartners(data);
  }

  async function fetchQuotePartners() {
    const { data } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("quote_id", quoteId);

    if (data) setQuotePartners(data);
  }

  async function linkPartner(partnerId: string) {
    if (!service) return alert("Valitse palvelu");

    await supabase.from("quote_partners").insert({
      quote_id: quoteId,
      partner_id: partnerId,
      service,
      status: "lähetetty",
    });

    fetchQuotePartners();
  }

  async function autoMatchPartners() {
    if (!service) return alert("Valitse palvelu");

    const { data: quote } = await supabase
      .from("request_quotes")
      .select("*")
      .eq("id", quoteId)
      .single();

    const { data: allPartners } = await supabase
      .from("partners")
      .select("*");

    const matched = allPartners?.filter((p: any) => {
      const serviceMatch = p.services?.includes(service);
      const guestMatch =
        !p.max_guests ||
        !quote?.guest_count ||
        p.max_guests >= quote.guest_count;

      return serviceMatch && guestMatch;
    });

    if (!matched || matched.length === 0)
      return alert("Ei sopivia partnereita");

    const inserts = matched.map((p: any) => ({
      quote_id: quoteId,
      partner_id: p.id,
      service,
      status: "lähetetty",
    }));

    await supabase.from("quote_partners").insert(inserts);

    fetchQuotePartners();
    alert("Auto match valmis ✅");
  }

  async function updateStatus(id: string, status: string) {
    await supabase
      .from("quote_partners")
      .update({ status })
      .eq("id", id);

    fetchQuotePartners();
  }

  function getName(p: any) {
    return p?.partner_details?.name || `Partneri ${p.id.slice(0, 6)}`;
  }

  function findPartner(id: string) {
    return partners.find((p) => p.id === id);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "kiinnostunut":
        return "green";
      case "ei_saatavilla":
        return "red";
      case "valittu":
        return "blue";
      default:
        return "gray";
    }
  }

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 20 }}>Tarjouspyynnön partnerit</h1>

      {/* 🔵 LINKED */}
      <h2>Liitetyt partnerit</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {quotePartners.map((qp) => {
          const partner = findPartner(qp.partner_id);

          return (
            <div
              key={qp.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 16,
                background: "#fafafa",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {partner ? getName(partner) : qp.partner_id}
              </h3>

              <p style={{ margin: "6px 0" }}>
                {qp.service} –{" "}
                <strong style={{ color: getStatusColor(qp.status) }}>
                  {qp.status}
                </strong>
              </p>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => updateStatus(qp.id, "kiinnostunut")}>
                  ✅ Kiinnostunut
                </button>
                <button onClick={() => updateStatus(qp.id, "ei_saatavilla")}>
                  ❌ Ei saatavilla
                </button>
                <button onClick={() => updateStatus(qp.id, "valittu")}>
                  ⭐ Valittu
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🟡 ADD */}
      <h2 style={{ marginTop: 30 }}>Liitä uusi partneri</h2>

      <div style={{ marginBottom: 10 }}>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="">Valitse palvelu</option>
          <option value="juhlatila">Juhlatila</option>
          <option value="catering">Catering</option>
          <option value="valokuvaus">Valokuvaus</option>
          <option value="musiikki">DJ</option>
        </select>
      </div>

      <button
        onClick={autoMatchPartners}
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          background: "#111",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        🔍 Auto match
      </button>

      {/* 🟢 ALL */}
      <h2 style={{ marginTop: 30 }}>Kaikki partnerit</h2>

      <ul style={{ paddingLeft: 0 }}>
        {partners.map((p) => (
          <li
            key={p.id}
            style={{
              listStyle: "none",
              marginBottom: 8,
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 6,
            }}
          >
            {getName(p)}{" "}
            <button onClick={() => linkPartner(p.id)}>Liitä</button>
          </li>
        ))}
      </ul>
    </main>
  );
}