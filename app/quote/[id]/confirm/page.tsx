"use client";

import { useEffect, useState } from "react";

import {
  useParams,
  useRouter,
  useSearchParams,
}
 from "next/navigation";import { supabase } from "@/lib/supabase";
import PageContainer from "@/app/components/PageContainer";

export default function ConfirmPage() {

const params = useParams();
const router = useRouter();
const searchParams = useSearchParams();

const quoteId = params.id;
const accessToken = searchParams.get("token");

const [confirming, setConfirming] = useState(false);
const [confirmationError, setConfirmationError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false)
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadSelections();
  }, []);


async function loadSelections() {
  if (!accessToken) {
    setAccessDenied(true);
    setItems([]);
    setTotal(0);
    return;
  }

  const { data: matchingQuote, error: quoteError } =
    await supabase
      .from("request_quotes")
      .select("id")
      .eq("id", quoteId)
      .eq("access_token", accessToken)
      .maybeSingle();

  if (quoteError || !matchingQuote) {
    setAccessDenied(true);
    setItems([]);
    setTotal(0);
    return;
  }

  setAccessDenied(false);

  const { data: selections } = await supabase

      .from("quote_partners")
      .select("*")
      .eq("quote_id", quoteId)
.in("status", ["selected", "valittu"]);
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
  if (confirming) return;

  if (!accessToken) {
    setAccessDenied(true);
    return;
  }

  if (items.length === 0) {
    setConfirmationError(
      "Valitse vähintään yksi palveluntarjoaja ennen vahvistamista.",
    );
    return;
  }

  try {
    setConfirming(true);
    setConfirmationError("");

    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteId,
        accessToken,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (result.alreadyConfirmed) {
        alert("Tarjouspyyntö on jo vahvistettu.");

        router.replace(
          `/quote/${quoteId}?token=${encodeURIComponent(
            accessToken,
          )}`,
        );

        return;
      }

      throw new Error(
        result.error || "Vahvistaminen epäonnistui.",
      );
    }

    alert("✅ Palveluntarjoajan valinta vahvistettiin");

    router.replace(
      `/quote/${quoteId}?token=${encodeURIComponent(
        accessToken,
      )}`,
    );
  } catch (error) {
    console.error("CONFIRMATION ERROR:", error);

    setConfirmationError(
      error instanceof Error
        ? error.message
        : "Vahvistaminen epäonnistui.",
    );
  } finally {
    setConfirming(false);
  }
}

if (accessDenied) {
  return (
    <PageContainer>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          background: "#faf9f7",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            padding: 32,
            borderRadius: 20,
            background: "#ffffff",
            border: "1px solid #fecaca",
            textAlign: "center",
            color: "#111827",
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 16 }}>🔒</div>

          <h1 style={{ fontSize: 26, marginBottom: 12 }}>
            Linkki ei ole voimassa
          </h1>

          <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
            Vahvistussivua ei löytynyt tai linkin turvallinen
            tunniste on virheellinen.
          </p>
        </div>
      </main>
    </PageContainer>
  );
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
              marginBottom: 16,
              wordBreak: "break-word",
            }}
          >
            Kiitos valinnastasi
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#1f2937",
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            Tarkista valitsemasi palveluntarjoajat ja hinnat.
<br />
Vahvistamisen jälkeen välitämme yhteystiedot osapuolille.
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
            <h3
  style={{
    marginBottom: 12,
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  }}
>
  📨 Mitä tapahtuu seuraavaksi?
</h3>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                color: "#111827",
                lineHeight: 1.8,
                textAlign: "left",
              }}
            >
             <li>✅ Vahvistamme valintasi palveluntarjoajalle</li>
<li>✅ Palveluntarjoaja saa tarvittavat yhteystietosi</li>
<li>✅ Hän ottaa sinuun yhteyttä yksityiskohtien sopimiseksi</li>
<li>✅ Sopimus ja maksaminen hoidetaan suoraan palveluntarjoajan kanssa</li>
            </ul>
          </div>

          <div
            style={{
              marginBottom: 40,
              textAlign: "left",
            }}
          >
            <h3
  style={{
    marginBottom: 16,
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  }}
>
  🎉 Valitsemasi palvelut
</h3>

{items.map((item) => (
  <div
    key={item.id}
    style={{
      background: "#fff",
      padding: 24,
      borderRadius: 20,
      marginBottom: 16,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      border: "1px solid #e5e7eb",
    }}
  >
    {item.partner?.images && (
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          overflowX: "auto",
        }}
      >
        {item.partner.images
          .split(",")
          .map((img: string, index: number) => {
            const imageUrl = img.trim();

            if (!imageUrl) return null;

            return (
              <img
                key={`${item.id}-${index}`}
                src={imageUrl}
                alt={
                  item.partner?.company
                    ? `${item.partner.company} kuva`
                    : "Palveluntarjoajan kuva"
                }
                style={{
                  width: 120,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              />
            );
          })}
      </div>
    )}

    <div
      style={{
        fontWeight: "bold",
        fontSize: 32,
        color: "#111827",
        wordBreak: "break-word",
      }}
    >
      {item.partner?.company || "Palveluntarjoaja"}
    </div>

    <div
      style={{
        marginTop: 8,
        color: "#10b981",
        fontSize: 28,
        fontWeight: "bold",
      }}
    >
      💰 {item.offer_price} €
    </div>
  </div>
))}
           <div
  style={{
    fontSize: 36,
    color: "#10b981",
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
  }}
>
  💰 Yhteensä: {total} €
</div>

{confirmationError && (
  <div
    role="alert"
    style={{
      marginBottom: 16,
      padding: 14,
      borderRadius: 10,
      border: "1px solid #fecaca",
      background: "#fef2f2",
      color: "#b91c1c",
      fontSize: 15,
      lineHeight: 1.5,
      textAlign: "left",
    }}
  >
    {confirmationError}
  </div>
)}

<button
  type="button"
  onClick={() => void approveFinally()}
  disabled={confirming || items.length === 0}
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
    cursor:
      confirming || items.length === 0
        ? "not-allowed"
        : "pointer",
    opacity:
      confirming || items.length === 0 ? 0.6 : 1,
    marginBottom: 40,
  }}
>
  {confirming
    ? "Vahvistetaan..."
    : "✅ Vahvista palveluntarjoajan valinta"}
</button>
          </div>

          <p
            style={{
              fontSize: 14,
              color: "#1f2937",
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