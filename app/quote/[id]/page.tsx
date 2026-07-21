"use client";

import { useEffect, useState } from "react";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import PageContainer from "@/app/components/PageContainer";

function formatOfferExpiry(value: string | null) {
  if (!value) return null;

  const date = new Date(
    value.includes("T") ? value : `${value}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fi-FI").format(date);
}

function isOfferExpired(value: string | null) {
  if (!value) return false;

  const expirationDate = new Date(
    value.includes("T") ? value : `${value}T23:59:59`,
  );

  if (Number.isNaN(expirationDate.getTime())) {
    return false;
  }

  return expirationDate.getTime() < Date.now();
}
export default function QuotePage() {
  const params = useParams();
const router = useRouter();
const searchParams = useSearchParams();

const quoteId = params.id;
const accessToken = searchParams.get("token");

const [selectingOfferId, setSelectingOfferId] =
  useState<number | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);
  const [quote, setQuote] = useState<any | null>(null);
const [sortBy, setSortBy] = useState<
  "price" | "rating" | "newest"
>("price");
  useEffect(() => {
  void loadData();
}, [quoteId, accessToken]);

async function loadData() {
  if (!accessToken) {
    setAccessDenied(true);
    setQuote(null);
    setOffers([]);
    return;
  }

  try {
    const response = await fetch(
      `/api/quote/${encodeURIComponent(
        String(quoteId),
      )}?token=${encodeURIComponent(accessToken)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const result = await response.json().catch(() => ({}));

    if (response.status === 400 || response.status === 403) {
      setAccessDenied(true);
      setQuote(null);
      setOffers([]);
      return;
    }

    if (!response.ok) {
      throw new Error(
        result.error || "Tarjouspyynnön hakeminen epäonnistui.",
      );
    }

    setAccessDenied(false);
    setQuote(result.quote ?? null);
    setQuoteStatus(result.quote?.status ?? null);
    setOffers(
      Array.isArray(result.offers) ? result.offers : [],
    );
  } catch (error) {
    console.error("CUSTOMER QUOTE LOAD ERROR:", error);

    setQuote(null);
    setOffers([]);
    setAccessDenied(true);
  }
}
async function selectWinner(offer: any) {
  if (selectingOfferId !== null) return;

  if (!accessToken) {
    setAccessDenied(true);
    return;
  }

  if (!confirm("Haluatko valita tämän tarjouksen?")) {
    return;
  }

  try {
    setSelectingOfferId(Number(offer.id));

    const response = await fetch("/api/quote/select-offer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteId,
        offerId: offer.id,
        accessToken,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.error || "Tarjouksen valitseminen epäonnistui.",
      );
    }

    alert("✅ Tarjous valittu");

    router.push(
      `/quote/${quoteId}/confirm?token=${encodeURIComponent(
        accessToken,
      )}`,
    );
  } catch (error) {
    console.error("SELECT OFFER ERROR:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Tarjouksen valitseminen epäonnistui.",
    );
  } finally {
    setSelectingOfferId(null);
  }
}
  const offersByService = offers.reduce((acc: any, offer: any) => {
  const service = offer.service || "Muu palvelu";
  if (!acc[service]) acc[service] = [];
  acc[service].push(offer);
  return acc;
}, {});
const serviceCount = Object.keys(offersByService).length;

const selectableOfferCount = offers.filter(
  (offer) =>
    !isOfferExpired(offer.expires_at) &&
    (offer.status === "sent" || offer.status === "offered"),
).length;

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
            Tarjouspyyntöä ei löytynyt tai linkin turvallinen
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
    color: "#111827",
    marginBottom: 16,
    fontWeight: "bold",
    wordBreak: "break-word",
  }}
>
            🎉 Saapuneet tarjoukset
        </h1>
<p
  style={{
    color: "#111827",
    marginBottom: 20,
    fontSize: 18,
    lineHeight: 1.6,
  }}
>  Vertaa tarjouksia ja valitse paras vaihtoehto palvelulle.
</p>
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
    padding: 16,
    borderRadius: 14,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  }}
>
  <label
    htmlFor="offer-sort"
    style={{
      color: "#374151",
      fontSize: 15,
      fontWeight: 600,
    }}
  >
    Järjestä tarjoukset
  </label>

  <select
    id="offer-sort"
    value={sortBy}
    onChange={(event) =>
      setSortBy(
        event.target.value as "price" | "rating" | "newest",
      )
    }
    style={{
      minWidth: 190,
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #d1d5db",
      background: "#ffffff",
      color: "#111827",
      fontSize: 15,
      cursor: "pointer",
    }}
  >
    <option value="price">Halvin ensin</option>
    <option value="rating">Paras arvosana</option>
    <option value="newest">Uusin ensin</option>
  </select>
</div>
  {quote && (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      padding: 24,
      borderRadius: 16,
      marginBottom: 30,
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    }}
  >
    <h3
      style={{
        margin: "0 0 16px 0",
        fontSize: 26,
        fontWeight: "bold",
        color: "#111827",
        lineHeight: 1.3,
      }}
    >
      📋 Juhlan tiedot
    </h3>

    <p
      style={{
        margin: "0 0 12px 0",
        fontSize: 18,
        color: "#111827",
        fontWeight: 600,
        lineHeight: 1.6,
      }}
    >
      📅 {quote.date}
    </p>

    <p
      style={{
        margin: "0 0 12px 0",
        fontSize: 18,
        color: "#111827",
        fontWeight: 600,
        lineHeight: 1.6,
      }}
    >
      📍 {quote.location}
    </p>

    <p
      style={{
        margin: 0,
        fontSize: 18,
        color: "#111827",
        fontWeight: 600,
        lineHeight: 1.6,
      }}
    >
      👥 {quote.guests} vierasta
    </p>
  </div>
)}
{offers.length > 0 && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(150px, 1fr))",
      gap: 12,
      marginBottom: 24,
    }}
  >
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#15803d",
          fontSize: 28,
          fontWeight: "bold",
        }}
      >
        {offers.length}
      </div>

      <div style={{ color: "#374151", fontSize: 14 }}>
        Saapunutta tarjousta
      </div>
    </div>

    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#1d4ed8",
          fontSize: 28,
          fontWeight: "bold",
        }}
      >
        {serviceCount}
      </div>

      <div style={{ color: "#374151", fontSize: 14 }}>
        Palvelukategoriaa
      </div>
    </div>

    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: "#fffbeb",
        border: "1px solid #fde68a",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#b45309",
          fontSize: 28,
          fontWeight: "bold",
        }}
      >
        {selectableOfferCount}
      </div>

      <div style={{ color: "#374151", fontSize: 14 }}>
        Valittavissa
      </div>
    </div>
  </div>
)}

{quoteStatus === "confirmed" && (
  <div
    style={{
      background: "#dcfce7",
      border: "1px solid #86efac",
      color: "#111827",
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      fontSize: 17,
      fontWeight: "bold",
      lineHeight: 1.5,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
    color: "#111827",
  }}
>
              {service}</h2>

        

{[...list]
  .sort((a: any, b: any) => {
    if (sortBy === "price") {
      return (
        Number(a.offer_price ?? Number.MAX_SAFE_INTEGER) -
        Number(b.offer_price ?? Number.MAX_SAFE_INTEGER)
      );
    }

    if (sortBy === "rating") {
      return (
        Number(b.partner?.averageRating ?? 0) -
        Number(a.partner?.averageRating ?? 0)
      );
    }

    return (
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
    );
  })
  .map((o: any) => {
const isSelected =
  o.status === "selected" || o.status === "valittu";

const expired = isOfferExpired(o.expires_at);
              return (
                <div
                  key={o.id}
                  

style={{
  background: isSelected
    ? "#ecfdf5"
    : expired
      ? "#f9fafb"
      : "#ffffff",
  borderRadius: 18,
  padding: 24,
  marginBottom: 20,
  border: isSelected
    ? "2px solid #10b981"
    : expired
      ? "1px solid #fecaca"
      : "1px solid #e5e7eb",
  boxShadow: isSelected
    ? "0 12px 30px rgba(16,185,129,0.16)"
    : "0 10px 25px rgba(0,0,0,0.08)",
  opacity: expired && !isSelected ? 0.82 : 1,
  transition: "all 0.2s ease",
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

{expired && !isSelected && (
  <div
    style={{
      background: "#fee2e2",
      color: "#b91c1c",
      display: "inline-block",
      padding: "5px 11px",
      borderRadius: 999,
      marginBottom: 10,
      fontSize: 12,
      fontWeight: "bold",
    }}
  >
    Vanhentunut
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
    color: "#111827",
    wordBreak: "break-word",
  }}
>
  {o.partner?.company}
</h3>
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    color: "#374151",
    fontSize: 15,
    fontWeight: 600,
  }}
>
  {o.partner?.averageRating ? (
    <>
      <span style={{ color: "#f59e0b" }}>⭐</span>

      <span>{o.partner.averageRating} / 5</span>

      <span style={{ color: "#6b7280", fontWeight: 400 }}>
        ({o.partner.reviewCount} arvostelua)
      </span>
    </>
  ) : (
    <span style={{ color: "#6b7280", fontWeight: 400 }}>
      Ei vielä arvosteluja
    </span>
  )}
</div>
<div
  style={{
    fontSize: 38,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 12,
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
    color: "#374151",
  }}
>
                     “{o.offer_message}”
                      </p>
                    )}

{o.expires_at && (
  <div
    style={{
      marginBottom: 16,
      padding: "12px 14px",
      borderRadius: 10,
      background: expired ? "#fef2f2" : "#f0fdf4",
      border: expired
        ? "1px solid #fecaca"
        : "1px solid #bbf7d0",
      color: expired ? "#b91c1c" : "#166534",
      fontSize: 15,
      fontWeight: 600,
    }}
  >
    {expired
      ? `Tarjous vanhentui ${formatOfferExpiry(o.expires_at)}`
      : `Tarjous voimassa ${formatOfferExpiry(o.expires_at)} asti`}
  </div>
)}
                    {!isSelected &&
  !expired &&
  (o.status === "sent" || o.status === "offered") &&
  o.offer_price && (

<button
  type="button"
  onClick={() => void selectWinner(o)}
  disabled={selectingOfferId !== null}
  style={{
    width: "100%",
    padding: "16px",
    borderRadius: 10,
    background: "#10b981",
    color: "white",
    border: "none",
    fontWeight: "bold",
    fontSize: 16,
    cursor:
      selectingOfferId !== null
        ? "not-allowed"
        : "pointer",
    opacity: selectingOfferId !== null ? 0.6 : 1,
  }}
>
  {selectingOfferId === Number(o.id)
    ? "Valitaan..."
    : "✅ Valitse tarjous"}
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