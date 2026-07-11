"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login() {
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/partner");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #f9fafb, #eef2f3)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 32,
          borderRadius: 16,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
<h1
  style={{
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  }}
>
  🔐 Partner Login
</h1>
        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>{error}</p>
        )}

        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
style={{
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 16,
  boxSizing: "border-box",
  color: "#111827",
background: "#ffffff",
}}        />
<p
  style={{
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 1.5,
  }}
>
  Kirjaudu sisään hallinnoidaksesi tarjouksiasi.
</p>

        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 20 }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: "none",
            background:
              "linear-gradient(90deg, #10b981, #34d399)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Kirjaudu sisään
        </button>
      </div>
    </main>
  );
}