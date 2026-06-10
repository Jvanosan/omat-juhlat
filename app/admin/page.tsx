"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  // 🔐 Tarkistetaan admin‑oikeus
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

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

  if (loading) {
    return <p style={{ padding: 40 }}>Ladataan kumppaneita…</p>;
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>🛠️ Admin – OmatJuhlat</h1>

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