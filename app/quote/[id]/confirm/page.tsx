"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageContainer from "@/app/components/PageContainer";

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
    const { data: selections } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("quote_id", quoteId)
      .eq("status", "valittu");

    if (!selections) return;

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quoteId }),
    });

    alert("✅ Varaus vahvistettu");

    router.replace(`/quote/${quoteId}`);
  }

  return (
    <PageContainer>
      <main
        style={{
          minHeight: "100vh",
          background: "#faf9f7",
          padding: "40px 16px",
          fontFamily: "Arial, sans-serif",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>
            🎉
          </div>

          <h1
            style={{
              fontSize: 28,
              marginBottom: 16,
              wordBreak: "break-word",
            }}
          >
            Kiitos valinnastasi
          </h1>

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

          <div
            style={{
              background: "#ffffff",
              padding: 20,
              borderRadius: 20,
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              marginBottom: 40,
            }}
          >
            <h3 style={{ marginBottom: 12 }}>
              📨 Mitä tapahtuu seuraavaksi?
            </h3>

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
              <li>
                ✅ Hän ottaa sinuun yhteyttä sopiakseen yksityiskohdista
              </li>
              <li>
                ✅ Maksu ja tarkat järjestelyt sovitaan suoraan hänen kanssaan
              </li>
            </ul>
          </div>

          <div
            style={{
              marginBottom: 40,
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: 16 }}>
              🎉 Valitsemasi palvelut
            </h3>

            {items.map((item) => (
              <div
  style={{
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  }}
>
               
                  {item.partner.images
  .split(",")
  .map((img: string, i: number) => (
    <img
      key={i}
      src={img.trim()}
      alt={item.partner?.company}
      style={{
        height: 60,
        width: 90,
        objectFit: "cover",
        borderRadius: 8,
      }}
    />
  ))}
                <div
                  style={{
                    fontWeight: "bold",
                    wordBreak: "break-word",
                  }}
                >
                  {item.partner?.company}
                </div>

                <div
  style={{
    marginTop: 8,
    color: "#111827",
    fontSize: 24,
    fontWeight: "bold",
  }}
>
  💰 {item.offer_price} €
</div>
              </div>
            ))}

            <div
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginTop: 30,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              💰 Yhteensä: {total} €
            </div>

            <button
              onClick={approveFinally}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 12,
                border: "none",
                background:
                  "linear-gradient(90deg, #10b981, #34d399)",
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: 40,
              }}
            >
              ✅ Vahvista lopullisesti
            </button>
          </div>

          <p
            style={{
              fontSize: 14,
              color: "#777",
            }}
          >
            OmatJuhlat yhdistää asiakkaat luotettaviin
            juhlapalveluiden tarjoajiin. Olemme apunasi,
            jos sinulle herää kysymyksiä.
          </p>
        </div>
      </main>
    </PageContainer>
  );
}