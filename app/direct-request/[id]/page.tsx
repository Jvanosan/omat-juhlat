"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
} from "next/navigation";

import PageContainer from "@/app/components/PageContainer";

type SortOption = "price" | "rating" | "newest";

function formatDate(value: string | null) {
  if (!value) return "Ei ilmoitettu";

  const date = new Date(
    value.includes("T") ? value : `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fi-FI").format(date);
}

function isOfferExpired(value: string | null) {
  if (!value) return true;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return true;

  return date.getTime() < Date.now();
}

export default function DirectRequestPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const directRequestId = String(params.id ?? "");
  const accessToken = searchParams.get("token");

  const [directRequest, setDirectRequest] =
    useState<any | null>(null);

  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectingOfferId, setSelectingOfferId] =
    useState<string | null>(null);

  const [sortBy, setSortBy] =
    useState<SortOption>("price");

  useEffect(() => {
    void loadData();
  }, [directRequestId, accessToken]);

  async function loadData() {
    if (!accessToken) {
      setAccessDenied(true);
      setDirectRequest(null);
      setOffers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `/api/direct-request/${encodeURIComponent(
          directRequestId
        )}?token=${encodeURIComponent(accessToken)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => ({}));

      if (
        response.status === 400 ||
        response.status === 403 ||
        response.status === 404
      ) {
        setAccessDenied(true);
        setDirectRequest(null);
        setOffers([]);
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Tarjouspyynnön hakeminen epäonnistui."
        );
      }

      setAccessDenied(false);
      setDirectRequest(result.request ?? null);
      setOffers(
        Array.isArray(result.offers)
          ? result.offers
          : []
      );
    } catch (error) {
      console.error(
        "CUSTOMER DIRECT REQUEST LOAD ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Tarjouspyynnön hakeminen epäonnistui."
      );
    } finally {
      setLoading(false);
    }
  }

  async function selectOffer(offer: any) {
    if (selectingOfferId !== null) return;

    if (!accessToken) {
      setAccessDenied(true);
      return;
    }

    if (
      !confirm(
        `Haluatko valita yrityksen ${
          offer.partner?.company || "tarjouksen"
        }?`
      )
    ) {
      return;
    }

    try {
      setSelectingOfferId(String(offer.id));

      const response = await fetch(
        "/api/direct-request/select-offer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            directRequestId,
            offerId: offer.id,
            accessToken,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Tarjouksen valitseminen epäonnistui."
        );
      }

      alert("✅ Tarjous valittu onnistuneesti.");

      await loadData();
    } catch (error) {
      console.error(
        "DIRECT OFFER SELECTION ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Tarjouksen valitseminen epäonnistui."
      );
    } finally {
      setSelectingOfferId(null);
    }
  }

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortBy === "price") {
      return Number(a.price) - Number(b.price);
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
  });

  const selectableOfferCount = offers.filter(
    (offer) =>
      offer.status === "sent" &&
      !isOfferExpired(offer.expires_at)
  ).length;

  const acceptedOffer = offers.find(
    (offer) => offer.status === "accepted"
  );

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
            <div style={{ fontSize: 42, marginBottom: 16 }}>
              🔒
            </div>

            <h1
              style={{
                fontSize: 26,
                marginBottom: 12,
              }}
            >
              Linkki ei ole voimassa
            </h1>

            <p
              style={{
                color: "#4b5563",
                lineHeight: 1.6,
              }}
            >
              Tarjouspyyntöä ei löytynyt tai linkin
              turvallinen tunniste on virheellinen.
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
            background: "#ffffff",
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
            🎉 Saapuneet suorat tarjoukset
          </h1>

          <p
            style={{
              color: "#374151",
              marginBottom: 24,
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            Vertaa valitsemiesi palveluntarjoajien
            tarjouksia rauhassa. Tarjouspyyntö ei sido
            sinua valitsemaan tarjousta.
          </p>

          {loading && (
            <div
              style={{
                padding: 30,
                textAlign: "center",
                color: "#4b5563",
              }}
            >
              Ladataan tarjouspyyntöä...
            </div>
          )}

          {errorMessage && !loading && (
            <div
              style={{
                padding: 16,
                marginBottom: 20,
                borderRadius: 12,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
              }}
            >
              {errorMessage}
            </div>
          )}

          {!loading && directRequest && (
            <>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  padding: 24,
                  borderRadius: 16,
                  marginBottom: 24,
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 16px",
                    fontSize: 26,
                    color: "#111827",
                  }}
                >
                  📋 Juhlan tiedot
                </h2>

                <p
                  style={{
                    margin: "0 0 10px",
                    color: "#111827",
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  🎉{" "}
                  {directRequest.event_type ||
                    "Tapahtuma"}
                </p>

                <p
                  style={{
                    margin: "0 0 10px",
                    color: "#111827",
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  📅 {formatDate(directRequest.event_date)}
                </p>

                <p
                  style={{
                    margin: "0 0 10px",
                    color: "#111827",
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  📍{" "}
                  {directRequest.location ||
                    "Ei ilmoitettu"}
                </p>

                <p
                  style={{
                    margin: 0,
                    color: "#111827",
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  👥 {directRequest.guests} vierasta
                </p>
              </div>

              {acceptedOffer && (
                <div
                  style={{
                    padding: 16,
                    marginBottom: 24,
                    borderRadius: 12,
                    background: "#dcfce7",
                    border: "1px solid #86efac",
                    color: "#166534",
                    fontWeight: "bold",
                  }}
                >
                  ✅ Olet valinnut yrityksen{" "}
                  {acceptedOffer.partner?.company ||
                    "palveluntarjoajan"}{" "}
                  tarjouksen.
                </div>
              )}

              {offers.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
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

                    <div
                      style={{
                        color: "#374151",
                        fontSize: 14,
                      }}
                    >
                      Saapunutta tarjousta
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

                    <div
                      style={{
                        color: "#374151",
                        fontSize: 14,
                      }}
                    >
                      Valittavissa
                    </div>
                  </div>
                </div>
              )}

              {offers.length > 1 && !acceptedOffer && (
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
                    htmlFor="direct-offer-sort"
                    style={{
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Järjestä tarjoukset
                  </label>

                  <select
                    id="direct-offer-sort"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value as SortOption
                      )
                    }
                    style={{
                      minWidth: 190,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#111827",
                    }}
                  >
                    <option value="price">
                      Halvin ensin
                    </option>
                    <option value="rating">
                      Paras arvosana
                    </option>
                    <option value="newest">
                      Uusin ensin
                    </option>
                  </select>
                </div>
              )}

              {offers.length === 0 && (
                <div
                  style={{
                    padding: 24,
                    borderRadius: 14,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    color: "#4b5563",
                    textAlign: "center",
                  }}
                >
                  Ei vielä tarjouksia. Voit palata tälle
                  sivulle myöhemmin sähköpostissa olevan
                  turvallisen linkin kautta.
                </div>
              )}

              {sortedOffers.map((offer) => {
                const expired = isOfferExpired(
                  offer.expires_at
                );

                const accepted =
                  offer.status === "accepted";

                const images =
                  typeof offer.partner?.images === "string"
                    ? offer.partner.images
                        .split(",")
                        .map((image: string) =>
                          image.trim()
                        )
                        .filter(Boolean)
                    : [];

                return (
                  <article
                    key={offer.id}
                    style={{
                      padding: 24,
                      marginBottom: 20,
                      borderRadius: 18,
                      background: accepted
                        ? "#ecfdf5"
                        : expired
                          ? "#f9fafb"
                          : "#ffffff",
                      border: accepted
                        ? "2px solid #10b981"
                        : expired
                          ? "1px solid #fecaca"
                          : "1px solid #e5e7eb",
                      boxShadow: accepted
                        ? "0 12px 30px rgba(16,185,129,0.16)"
                        : "0 10px 25px rgba(0,0,0,0.08)",
                      opacity:
                        expired && !accepted ? 0.82 : 1,
                    }}
                  >
                    {accepted && (
                      <div
                        style={{
                          display: "inline-block",
                          marginBottom: 12,
                          padding: "5px 11px",
                          borderRadius: 999,
                          background: "#10b981",
                          color: "#ffffff",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        ✅ Valittu
                      </div>
                    )}

                    {expired && !accepted && (
                      <div
                        style={{
                          display: "inline-block",
                          marginBottom: 12,
                          padding: "5px 11px",
                          borderRadius: 999,
                          background: "#fee2e2",
                          color: "#b91c1c",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        Vanhentunut
                      </div>
                    )}

                    {images.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          overflowX: "auto",
                          marginBottom: 12,
                        }}
                      >
                        {images.map(
                          (image: string, index: number) => (
                            <img
                              key={`${offer.id}-${index}`}
                              src={image}
                              alt={
                                offer.partner?.company
                                  ? `${offer.partner.company} kuva`
                                  : "Palveluntarjoajan kuva"
                              }
                              style={{
                                height: 80,
                                width: 120,
                                flexShrink: 0,
                                objectFit: "cover",
                                borderRadius: 10,
                              }}
                            />
                          )
                        )}
                      </div>
                    )}

                    <h2
                      style={{
                        marginBottom: 8,
                        fontSize: 24,
                        color: "#111827",
                        wordBreak: "break-word",
                      }}
                    >
                      {offer.partner?.company ||
                        "Palveluntarjoaja"}
                    </h2>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 12,
                        color: "#374151",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      {offer.partner?.averageRating ? (
                        <>
                          <span>⭐</span>
                          <span>
                            {
                              offer.partner
                                .averageRating
                            }{" "}
                            / 5
                          </span>
                          <span
                            style={{
                              color: "#6b7280",
                              fontWeight: 400,
                            }}
                          >
                            (
                            {
                              offer.partner
                                .reviewCount
                            }{" "}
                            arvostelua)
                          </span>
                        </>
                      ) : (
                        <span
                          style={{
                            color: "#6b7280",
                            fontWeight: 400,
                          }}
                        >
                          Ei vielä arvosteluja
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        marginBottom: 12,
                        color: "#10b981",
                        fontSize: 38,
                        fontWeight: "bold",
                      }}
                    >
                      💰 {offer.price} €
                    </div>

                    {offer.message && (
                      <p
                        style={{
                          marginBottom: 16,
                          color: "#374151",
                          fontSize: 17,
                          lineHeight: 1.6,
                          whiteSpace: "pre-line",
                        }}
                      >
                        “{offer.message}”
                      </p>
                    )}

                    <div
                      style={{
                        marginBottom: 16,
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: expired
                          ? "#fef2f2"
                          : "#f0fdf4",
                        border: expired
                          ? "1px solid #fecaca"
                          : "1px solid #bbf7d0",
                        color: expired
                          ? "#b91c1c"
                          : "#166534",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      {expired
                        ? `Tarjous vanhentui ${formatDate(
                            offer.expires_at
                          )}`
                        : `Tarjous voimassa ${formatDate(
                            offer.expires_at
                          )} asti`}
                    </div>

                    {!accepted &&
                      !acceptedOffer &&
                      !expired &&
                      offer.status === "sent" && (
                        <button
                          type="button"
                          onClick={() =>
                            void selectOffer(offer)
                          }
                          disabled={
                            selectingOfferId !== null
                          }
                          style={{
                            width: "100%",
                            padding: 16,
                            borderRadius: 10,
                            border: "none",
                            background: "#10b981",
                            color: "#ffffff",
                            fontSize: 16,
                            fontWeight: "bold",
                            cursor:
                              selectingOfferId !== null
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              selectingOfferId !== null
                                ? 0.6
                                : 1,
                          }}
                        >
                          {selectingOfferId ===
                          String(offer.id)
                            ? "Valitaan..."
                            : "✅ Valitse tarjous"}
                        </button>
                      )}
                  </article>
                );
              })}
            </>
          )}
        </div>
      </main>
    </PageContainer>
  );
}