"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const parseArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

type Item = {
  id: number;
  status: string;
  service: string;
  partner: {
    id: string;
    company: string;
    area: string;
    services: any;
    images: any;
    partner_details: any;
  };
};

export default function QuoteComparePage() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quoteId) return;

    fetch(`/api/quote/compare?quoteId=${quoteId}`)
      .then(res => res.json())
      .then(data => {
        setItems(data || []);
        setLoading(false);
      });
  }, [quoteId]);

  if (loading) {
    return <main style={{ padding: 40 }}>Ladataan…</main>;
  }

  const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
    acc[item.service] = acc[item.service] || [];
    acc[item.service].push(item);
    return acc;
  }, {});

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1>📋 Valitse palvelut tapahtumaasi</h1>

      {Object.entries(grouped).map(([service, list]) => (
        <section key={service} style={{ marginBottom: 48 }}>
          <h2>{service}</h2>

          {list.map(item => {
            const images = parseArray(item.partner.images);
            const details = item.partner.partner_details?.[service.toLowerCase()];

            return (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20,
                  background: "#fff",
                }}
              >
                <strong>{item.partner.company}</strong>
                <div style={{ color: "#666" }}>{item.partner.area}</div>

                {images?.length > 0 && (
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    {images.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        style={{
                          width: 120,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* ✅ LISÄTIEDOT */}
                {details && (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 14,
                      color: "#444",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Lisätiedot:</strong>
                    <ul>
                      {Object.entries(details).map(([key, value]) => (
                        <li key={key}>
                          {key}:{" "}
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </main>
  );
}