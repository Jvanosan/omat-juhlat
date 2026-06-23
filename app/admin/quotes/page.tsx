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
    return <p>Ladataan…</p>;
  }

  return (
    <main style={{ padding: 40 }}>
      {/* YLÄPALKKI */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Tarjouspyynnöt (Admin)</h1>

        <button
          onClick={handleLogout}
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Kirjaudu ulos
        </button>
      </div>

      <QuotesClient />
    </main>
  );
}