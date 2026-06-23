"use client";

import { useEffect, useState } from "react";

/* Sallitut statukset */
type QuoteStatus = "avoin" | "käsittelyssä" | "suljettu";

/* Tarjouspyynnön tyyppi */
type RequestQuote = {
  id: string;
  status: QuoteStatus;

  name: string;
  email: string;
  eventType: string;
  location: string;
  date: string;
  guests: number;
};

/* Status-badge (värillinen pallo/teksti) */
function StatusBadge({ status }: { status: QuoteStatus }) {
  const styles: Record<QuoteStatus, React.CSSProperties> = {
    avoin: {
      backgroundColor: "#e6f4ea",
      color: "#1e7e34",
      padding: "4px 10px",
      borderRadius: 12,
      fontWeight: "bold",
      fontSize: 12,
    },
    käsittelyssä: {
      backgroundColor: "#fff3cd",
      color: "#856404",
      padding: "4px 10px",
      borderRadius: 12,
      fontWeight: "bold",
      fontSize: 12,
    },
    suljettu: {
      backgroundColor: "#e2e3e5",
      color: "#383d41",
      padding: "4px 10px",
      borderRadius: 12,
      fontWeight: "bold",
      fontSize: 12,
    },
  };

  return <span style={styles[status]}>{status}</span>;
}

export default function QuotesClient() {
  const [quotes, setQuotes] = useState<RequestQuote[]>([]);
  const [loading, setLoading] = useState(true);

  /* Hae tarjouspyynnöt */
  useEffect(() => {
    fetch("/api/admin/request-quotes")
      .then((res) => res.json())
      .then((data) => {
        setQuotes(data);
        setLoading(false);
      });
  }, []);

  /* Päivitä status */
  async function updateStatus(id: string, status: QuoteStatus) {
    await fetch("/api/admin/request-quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    /* Päivitetään heti näkymään */
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status } : q
      )
    );
  }

  if (loading) {
    return <p>Ladataan tarjouspyyntöjä…</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Nimi</th>
          <th>Tapahtuma</th>
          <th>Paikka</th>
          <th>Päivä</th>
          <th>Vieraita</th>
          <th>Status</th>
          <th>Toiminnot</th>
        </tr>
      </thead>

      <tbody>
        {quotes.map((q) => (
          <tr key={q.id}>
            <td>{q.name}</td>
            <td>{q.eventType}</td>
            <td>{q.location}</td>
            <td>{q.date}</td>
            <td>{q.guests}</td>

            {/* STATUS BADGE */}
            <td>
              <StatusBadge status={q.status} />
            </td>

            {/* TOIMINNOT */}
            <td>
              {q.status === "avoin" && (
                <button
                  onClick={() =>
                    updateStatus(q.id, "käsittelyssä")
                  }
                >
                  Merkitse käsittelyyn
                </button>
              )}

              {q.status === "käsittelyssä" && (
                <button
                  onClick={() =>
                    updateStatus(q.id, "suljettu")
                  }
                >
                  Sulje pyyntö
                </button>
              )}

              {q.status === "suljettu" && (
                <span style={{ color: "#777" }}>
                  Ei toimintoja
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}