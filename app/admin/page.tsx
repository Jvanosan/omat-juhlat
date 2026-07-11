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
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingQuoteId, setProcessingQuoteId] = useState<string | null>(null);
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
  return (
    <p
      style={{
        padding: 40,
        color: "#111827",
        fontSize: 18,
        fontWeight: 600,
      }}
    >
      Tarkistetaan oikeuksia...
    </p>
  );
}
 const updatePartnerStatus = async (
  partnerId: string,
  status: "approved" | "rejected"
) => {
  try {
    setProcessingId(partnerId);

    const res = await fetch("/api/admin/partners/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId, status }),
    });

    if (!res.ok) {
      alert("Virhe tallennuksessa");
      return;
    }

    setPartners(prev =>
      prev.map(p =>
        p.id === partnerId ? { ...p, status } : p
      )
    );
  } catch (error) {
    console.error(error);
    alert("Jotain meni pieleen");
  } finally {
    setProcessingId(null);
  }
};
const updateQuoteStatus = async (
  quoteId: string,
  status: "avoin" | "käsittelyssä" | "suljettu"
) => {
  try {
    setProcessingQuoteId(quoteId);

    const res = await fetch("/api/admin/quotes/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId, status }),
    });

    if (!res.ok) {
      alert("Virhe tallennuksessa");
      return;
    }

    setRequests((prev) =>
      prev.map((q) =>
        q.id === quoteId ? { ...q, status } : q
      )
    );
  } catch (error) {
    console.error(error);
    alert("Jotain meni pieleen");
  } finally {
    setProcessingQuoteId(null);
  }
};
  if (loading) {
  return (
    <p
      style={{
        padding: 40,
        color: "#111827",
        fontSize: 18,
        fontWeight: 600,
      }}
    >
      Ladataan kumppaneita...
    </p>
  );
}

  return (
<main
  style={{
    minHeight: "100vh",
    padding: 40,
    fontFamily: "Arial, sans-serif",
    color: "#111827",
    background: "#f3f4f6",
  }}
>
  <div
  style={{
    background: "#ffffff",
    borderRadius: 20,
    padding: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  }}
>

  <h1
  style={{
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  }}
>
  🛠️ Admin – OmatJuhlat
</h1>      
<h2
  style={{
    marginTop: 40,
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  }}
>
  📨 Tarjouspyynnöt</h2>

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

<td>
  <span
    style={{
      padding: "6px 12px",
      borderRadius: 999,
      fontWeight: "bold",
      color:
        r.status === "suljettu"
          ? "#166534"
          : r.status === "käsittelyssä"
          ? "#92400e"
          : "#1e3a8a",
      background:
        r.status === "suljettu"
          ? "#dcfce7"
          : r.status === "käsittelyssä"
          ? "#fef3c7"
          : "#dbeafe",
    }}
  >
    {r.status || "avoin"}
  </span>
</td>

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
    disabled={processingQuoteId === r.id}
    style={{
      padding: "6px 12px",
      borderRadius: 6,
      border: "none",
background: "#fbbf24",
color: "#111827",
fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    {processingQuoteId === r.id
      ? "Tallennetaan..."
      : "Merkitse käsittelyyn"}
  </button>
)}

{r.status === "käsittelyssä" && (
  <button
    onClick={() =>
      updateQuoteStatus(r.id, "suljettu")
    }
    disabled={processingQuoteId === r.id}
    style={{
      padding: "6px 12px",
      borderRadius: 6,
      border: "none",
background: "#22c55e",
color: "#ffffff",
fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    {processingQuoteId === r.id
      ? "Tallennetaan..."
      : "Sulje pyyntö"}
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
<h2
  style={{
    marginTop: 40,
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  }}
>
  🤝 Kumppanit
</h2>
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
  disabled={processingId === p.id}
  style={approveBtn}
>
  {processingId === p.id
    ? "Tallennetaan..."
    : "Hyväksy"}
</button>
            <button
  onClick={() => updatePartnerStatus(p.id, "rejected")}
  disabled={processingId === p.id}
  style={rejectBtn}
>
  {processingId === p.id
    ? "Tallennetaan..."
    : "Hylkää"}
</button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>
        </table>
      )}
      </div>
    </main>
  );
}

/* ===== STYLES ===== */

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16,
  background: "#ffffff",
  borderRadius: 12,
  overflow: "hidden",
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