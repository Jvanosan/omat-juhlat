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
const [applications, setApplications] = useState<any[]>([]);
const [reviews, setReviews] = useState<any[]>([]);
const [approvedReviews, setApprovedReviews] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingQuoteId, setProcessingQuoteId] = useState<string | null>(null);

  const [processingApplicationId, setProcessingApplicationId] =
  useState<string | null>(null);
  const [processingReviewId, setProcessingReviewId] =
  useState<string | null>(null);
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

    const { data: applicationData } = await supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false });

    setApplications(applicationData || []);

    const { data: reviewData, error: reviewError } = await supabase
  .from("partner_reviews")
  .select(`
    *,
    partners (
      company
    )
  `)
  .eq("approved", false)
  .order("created_at", { ascending: false });

if (reviewError) {
  console.error("Arvostelujen haku epäonnistui:", reviewError);
}

setReviews(reviewData || []);
const { data: approvedData } = await supabase
  .from("partner_reviews")
  .select(`
    *,
    partners (
      company
    )
  `)
  .eq("approved", true)
  .order("created_at", { ascending: false });

setApprovedReviews(approvedData || []);

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
const approveApplication = async (application: any) => {
  try {
    setProcessingApplicationId(application.id);

    const { error: partnerError } = await supabase
      .from("partners")
      .insert({
        company: application.company_name,
        email: application.email,
        phone: application.phone,
        description: application.description,
        category: application.service_category,
        area: application.city,

        verified: false,
        status: "pending",
      });

    if (partnerError) {
      alert(partnerError.message);
      return;
    }

    const { error: applicationError } = await supabase
      .from("partner_applications")
      .update({
        status: "approved",
      })
      .eq("id", application.id);

    if (applicationError) {
      alert(applicationError.message);
      return;
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.id === application.id
          ? { ...a, status: "approved" }
          : a
      )
    );
    await fetch("/api/admin/send-application-approved", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: application.email,
    contactName: application.contact_name,
    companyName: application.company_name,
  }),
});
  } finally {
    setProcessingApplicationId(null);
  }
};
const rejectApplication = async (applicationId: string) => {
  try {
    setProcessingApplicationId(applicationId);

    const { error } = await supabase
      .from("partner_applications")
      .update({
        status: "rejected",
      })
      .eq("id", applicationId);

    if (error) {
      alert(error.message);
      return;
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? { ...a, status: "rejected" }
          : a
      )
    );
  } finally {
    setProcessingApplicationId(null);
  }
};

const approveReview = async (reviewId: string) => {
  try {
    setProcessingReviewId(reviewId);

    const { error } = await supabase
      .from("partner_reviews")
      .update({
        approved: true,
      })
      .eq("id", reviewId);

    if (error) {
      alert(error.message);
      return;
    }

    setReviews((prev) =>
      prev.filter((r) => r.id !== reviewId)
    );
  } finally {
    setProcessingReviewId(null);
  }
};
const rejectReview = async (reviewId: string) => {
  try {
    setProcessingReviewId(reviewId);

    const { error } = await supabase
      .from("partner_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      alert(error.message);
      return;
    }

    setReviews((prev) =>
      prev.filter((r) => r.id !== reviewId)
    );
  } finally {
    setProcessingReviewId(null);
  }
};
async function handleLogout() {
  await supabase.auth.signOut();
  router.push("/login");
}
const totalPartners = partners.length;

const openRequests = requests.filter(
  (r) => r.status !== "suljettu"
).length;

const pendingApplications = applications.filter(
  (a) => a.status === "pending"
).length;

const pendingReviews = reviews.length;

const scrollToSection = (sectionId: string) => {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
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

  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  }}
>
  <h1
    style={{
      fontSize: 36,
      fontWeight: "bold",
      color: "#111827",
      margin: 0,
    }}
  >
    🛠️ Admin – OmatJuhlat
  </h1>

  <button
    onClick={handleLogout}
    style={{
      background: "#ef4444",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Kirjaudu ulos
  </button>
</div>  
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginTop: 30,
    marginBottom: 40,
  }}
>
  <button
  type="button"
  onClick={() => scrollToSection("partners-section")}
  style={dashboardCard}
>
  <div style={dashboardIcon}>👥</div>
  <div style={dashboardNumber}>{totalPartners}</div>
  <div style={dashboardLabel}>Kumppanit</div>
</button>

 <button
  type="button"
  onClick={() => scrollToSection("requests-section")}
  style={dashboardCard}
>
  <div style={dashboardIcon}>📨</div>
  <div style={dashboardNumber}>{openRequests}</div>
  <div style={dashboardLabel}>Avoimet tarjouspyynnöt</div>
</button>

  <button
  type="button"
  onClick={() => scrollToSection("applications-section")}
  style={dashboardCard}
>
  <div style={dashboardIcon}>📋</div>
  <div style={dashboardNumber}>{pendingApplications}</div>
  <div style={dashboardLabel}>Partnerihakemukset</div>
</button>

  <button
  type="button"
  onClick={() => scrollToSection("reviews-section")}
  style={dashboardCard}
>
  <div style={dashboardIcon}>⭐</div>
  <div style={dashboardNumber}>{pendingReviews}</div>
  <div style={dashboardLabel}>Odottavat arvostelut</div>
</button>
</div> 
<h2
  id="requests-section"
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
id="applications-section"
  style={{
    marginTop: 40,
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  }}
>
  📋 Partnerihakemukset
</h2>

{applications.length === 0 ? (
  <p>Ei partnerihakemuksia.</p>
) : (
  <table style={tableStyle}>
    <thead>
      <tr>
        <th>Yritys</th>
<th>Yhteyshenkilö</th>
<th>Sähköposti</th>
<th>Kaupunki</th>
<th>Palvelu</th>
<th>Status</th>
<th>Toiminnot</th>
      </tr>
    </thead>

    <tbody>
      {applications.map((a) => (
        <tr key={a.id}>
          <td>{a.company_name}</td>
          <td>{a.contact_name}</td>
          <td>{a.email}</td>
          <td>{a.city}</td>
          <td>{a.service_category}</td>
<td>
  {a.status === "pending" && (
    <>
      <button
        onClick={() => approveApplication(a)}
        disabled={processingApplicationId === a.id}
        style={approveBtn}
      >
        {processingApplicationId === a.id
          ? "Tallennetaan..."
          : "Hyväksy"}
      </button>
      <button
  onClick={() => rejectApplication(a.id)}
  disabled={processingApplicationId === a.id}
  style={rejectBtn}
>
  {processingApplicationId === a.id
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
<h2
id="reviews-section"
  style={{
    marginTop: 40,
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  }}
>
  ⭐ Odottavat arvostelut
</h2>

{reviews.length === 0 ? (
  <p>Ei odottavia arvosteluja.</p>
) : (
  <table style={tableStyle}>
    <thead>
      <tr>
        <th>Yritys</th>
        <th>Sähköposti</th>
        <th>Arvosana</th>
        <th>Arvostelu</th>
        <th>Päivä</th>
        <th>Toiminnot</th>
      </tr>
    </thead>

    <tbody>
      {reviews.map((review) => (
        <tr key={review.id}>
          <td>{review.partner_id}</td>
          <td>{review.customer_email}</td>
          <td>
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </td>
          <td>{review.review}</td>
          <td>
            {new Date(review.created_at).toLocaleDateString("fi-FI")}
          </td>
          <td>
  <button
    onClick={() => approveReview(review.id)}
    disabled={processingReviewId === review.id}
    style={approveBtn}
  >
    {processingReviewId === review.id
      ? "Tallennetaan..."
      : "Hyväksy"}
  </button>

  <button
    onClick={() => rejectReview(review.id)}
    disabled={processingReviewId === review.id}
    style={rejectBtn}
  >
    {processingReviewId === review.id
      ? "Tallennetaan..."
      : "Hylkää"}
  </button>
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
  ⭐ Hyväksytyt arvostelut
</h2>

{approvedReviews.length === 0 ? (
  <p>Ei hyväksyttyjä arvosteluja.</p>
) : (
  <table style={tableStyle}>
    <thead>
      <tr>
        <th>Yritys</th>
        <th>Sähköposti</th>
        <th>Arvosana</th>
        <th>Arvostelu</th>
        <th>Päivä</th>
      </tr>
    </thead>

    <tbody>
      {approvedReviews.map((review) => (
        <tr key={review.id}>
          <td>{review.partners?.company}</td>
          <td>{review.customer_email}</td>
          <td>
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </td>
          <td>{review.review}</td>
          <td>
            {new Date(review.created_at).toLocaleDateString("fi-FI")}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}
<h2
id="partners-section"
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

const dashboardCard: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 18,
  padding: 24,
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  border: "1px solid #ececec",

  cursor: "pointer",
  width: "100%",
  fontFamily: "inherit",
  transition: "all 0.2s ease",

  appearance: "none",
  WebkitAppearance: "none",
};

const dashboardIcon: React.CSSProperties = {
  fontSize: 36,
  marginBottom: 12,
};

const dashboardNumber: React.CSSProperties = {
  fontSize: 34,
  fontWeight: "bold",
  color: "#111827",
};

const dashboardLabel: React.CSSProperties = {
  marginTop: 8,
  color: "#6b7280",
  fontSize: 15,
};