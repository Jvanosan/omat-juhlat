"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id;

  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadSelections();
  }, []);

  async function loadSelections() {
    // valitut tarjoukset
    const { data: selections } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("quote_id", quoteId)
      .eq("status", "valittu");

    if (!selections) return;

    // partnerit
    const { data: partners } = await supabase
      .from("partners")
      .select("*");

    const combined = selections.map((s) => {
      const partner = partners?.find(
        (p) => String(p.id) === String(s.partner_id)
      );
      return {
        ...s,
        partner,
      };
    });

    setItems(combined);

    const sum = combined.reduce(
      (acc, cur) => acc + (cur.offer_price || 0),
      0
    );
    setTotal(sum);
  }

  async function approveFinally() {
    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId }),
    });

    alert("✅ Varaus vahvistettu");

    router.replace(`/quote/${quoteId}`);
  }
  return (
  <main
    style={{
      minHeight: "100vh",
      background: "#faf9f7",
      padding: "80px 20px",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
      {/* IKONI */}
      <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>

      {/* OTSIKKO */}
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>
        Kiitos valinnastasi
      </h1>

      {/* TEKSTI */}
      <p
        style={{
          fontSize: 18,
          color: "#555",
          marginBottom: 40,
          lineHeight: 1.6,
        }}
      >
        Olet valinnut juhlaasi sopivan palveluntarjoajan.
        <br />
        Olemme välittäneet tiedot eteenpäin.
      </p>

      {/* INFO-KORTTI */}
      <div
        style={{
          background: "#ffffff",
          padding: 32,
          borderRadius: 20,
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          marginBottom: 40,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>📨 Mitä tapahtuu seuraavaksi?</h3>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            color: "#444",
            lineHeight: 1.8,
            textAlign: "left",
          }}
        >
          <li>✅ Palveluntarjoaja on saanut yhteystietosi</li>
          <li>✅ Hän ottaa sinuun yhteyttä sopiakseen yksityiskohdista</li>
          <li>✅ Maksu ja tarkat järjestelyt sovitaan suoraan hänen kanssaan</li>
        </ul>
      </div>

      {/* LUOTTAMUSTEKSTI */}
      <p style={{ fontSize: 14, color: "#777" }}>
        OmatJuhlat yhdistää asiakkaat luotettaviin juhlapalveluiden
        tarjoajiin. Olemme apunasi, jos sinulle herää kysymyksiä.
      </p>
    </div>
  </main>
);

}