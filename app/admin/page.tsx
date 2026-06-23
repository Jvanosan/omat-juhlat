"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
type Partner = {
  id: string;
  company: string;
  email: string;
  area: string;
  max_guests: number;
  status: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);

  // 🔐 Tarkistetaan admin‑oikeus

useEffect(() => {
  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== "jvanosan2003@gmail.com") {
      router.push("/login");
      return;
    }

    setAuthorized(true);
  };

  checkAdmin();
}, [router]);
 // 📬 Haetaan tarjouspyynnöt admin‑näkymään
useEffect(() => {
  if (!authorized) return;

  const fetchRequests = async () => {
    // kaikki tarjouspyynnöt
    const { data: quotes } = await supabase
      .from("request_quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!quotes) return;

    // lasketaan tarjousten määrä
    const { data: offers } = await supabase
      .from("quote_partners")
      .select("quote_id");

    const withCounts = quotes.map((q) => ({
      ...q,
      offerCount:
        offers?.filter((o) => o.quote_id === q.id).length || 0,
    }));

    setRequests(withCounts);
  };

  fetchRequests();
}, [authorized]);

  // 📥 Haetaan kumppanit
  useEffect(() => {
    if (!authorized) return;

    const fetchPartners = async () => {
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      setPartners(data || []);
      setLoading(false);
    };

    fetchPartners();
  }, [authorized]);

  if (!authorized) {
    return <p style={{ padding: 40 }}>Tarkistetaan oikeuksia…</p>;
  }
 const updatePartnerStatus = async (
    partnerId: string,
    status: "approved" | "rejected"
  ) => {
    await fetch("/api/admin/partners/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId, status }),
    });

    setPartners(prev =>
      prev.map(p =>
        p.id === partnerId ? { ...p, status } : p
      )
    );
  };
// ✅ Päivitetään tarjouspyynnön tila (D5)
const updateQuoteStatus = async (
  quoteId: string,
  status: "avoin" | "käsittelyssä" | "suljettu"
) => {
  await fetch("/api/admin/quotes/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quoteId, status }),
  });

  // päivitetään näkymä heti
  setRequests((prev) =>
    prev.map((q) =>
      q.id === quoteId ? { ...q, status } : q
    )
  );
};
  if (loading) {
    return <p style={{ padding: 40 }}>Ladataan kumppaneita…</p>;
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>🛠️ Admin – OmatJuhlat</h1>
      <h2 style={{ marginTop: 40 }}>📨 Tarjouspyynnöt</h2>

{requests.length === 0 ? (
  <p>Ei tarjouspyyntöjä.</p>
) : (
  <table style={tableStyle}>
    <thead>
  <tr>
    <th>Päivä</th>
    <th>Alue</th>
    <th>Vieraita</th>
    <th>Tila</th>
    <th>Tarjouksia</th>
    <th>Linkki</th>
    <th>Toiminnot</th>
  </tr>
</thead>
    <tbody>
      {requests.map((r) => (
        <tr key={r.id}>
          <td>{r.date}</td>
          <td>{r.location}</td>
          <td>{r.guests}</td>
          <td>{r.status || "avoin"}</td>
          <td>{r.offerCount}</td>

         <td>
            <a
              href={`/quote/${r.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Avaa
            </a>
          </td>
          <td>
  {r.status === "avoin" && (
    <button
      onClick={() =>
        updateQuoteStatus(r.id, "käsittelyssä")
      }
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        background: "#fde68a",
        cursor: "pointer",
      }}
    >
      Merkitse käsittelyyn
    </button>
  )}

  {r.status === "käsittelyssä" && (
    <button
      onClick={() =>
        updateQuoteStatus(r.id, "suljettu")
      }
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        background: "#bbf7d0",
        cursor: "pointer",
      }}
    >
      Sulje pyyntö
    </button>
  )}

  {r.status === "suljettu" && (
    <span style={{ color: "#6b7280" }}>
      Ei toimintoja
    </span>
  )}
</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
      <h2 style={{ marginTop: 40 }}>🤝 Kumppanit</h2>

      {partners.length === 0 ? (
        <p>Ei kumppaneita vielä.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Yritys</th>
              <th>Email</th>
              <th>Alue</th>
              <th>Maks. vieraita</th>
              <th>Status</th>
              <th>Toiminnot</th>
            </tr>
          </thead>
          <tbody>
  {partners.map(p => (
    <tr key={p.id}>
      <td>{p.company}</td>
      <td>{p.email}</td>
      <td>{p.area}</td>
      <td>{p.max_guests}</td>
      <td>{p.status}</td>
      <td>
        {p.status === "pending" && (
          <>
            <button
              onClick={() => updatePartnerStatus(p.id, "approved")}
              style={approveBtn}
            >
              Hyväksy
            </button>
            <button
              onClick={() => updatePartnerStatus(p.id, "rejected")}
              style={rejectBtn}
            >
              Hylkää
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>
        </table>
      )}
    </main>
  );
}

/* ===== STYLES ===== */

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16,
};
const approveBtn: React.CSSProperties = {
  background: "#1a7f37",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  marginRight: 8,
  cursor: "pointer",
};

const rejectBtn: React.CSSProperties = {
  background: "#b42318",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};