"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import QuotesClient from "./QuotesClient";

/**
 * ✅ VAIN TÄMÄ SÄHKÖPOSTI ON ADMIN
 * (voit myöhemmin lisätä useampia)
 */
const ADMIN_EMAIL = "jvanosan2003@gmail.com";

export default function AdminQuotesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;

      // Ei kirjautunut
      if (!session) {
        router.push("/login");
        return;
      }

      // Kirjautunut, mutta EI admin
      if (session.user.email !== ADMIN_EMAIL) {
        supabase.auth.signOut();
        router.push("/login");
        return;
      }

      // ✅ Oikea admin
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
return (
  <main
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f3f4f6",
      color: "#111827",
      fontSize: 18,
      fontWeight: 600,
      fontFamily: "Arial, sans-serif",
    }}
  >
    Ladataan…
  </main>
);
  }

  return (
<main
  style={{
    minHeight: "100vh",
    padding: 24,
    background: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
  }}
>      {/* YLÄPALKKI */}
      <div
style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 16,
  marginBottom: 24,
}}
      >
<h1
  style={{
    margin: 0,
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 1.3,
    wordBreak: "break-word",
  }}
>
  📋 Tarjouspyynnöt
</h1>
        <button
          onClick={handleLogout}
style={{
  background: "#111827",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 15,
  whiteSpace: "nowrap",
  boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
}}
        >
          Kirjaudu ulos
        </button>
      </div>
<div
  style={{
    background: "#ffffff",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    overflowX: "auto",
  }}
>
  <QuotesClient />
</div>
    </main>
  );
}