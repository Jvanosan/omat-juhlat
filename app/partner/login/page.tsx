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
        padding: 20,
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          borderRadius: 18,
          padding: 32,
          boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#111827",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          🔐 Partner Login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#374151",
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Kirjaudu sisään hallinnoidaksesi tarjouksiasi.
        </p>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              borderRadius: 10,
              padding: 12,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#111827",
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginBottom: 24,
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#111827",
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 10,
            border: "none",
            background: "#10b981",
            color: "#ffffff",
            fontSize: 17,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Kirjaudu sisään
        </button>
      </div>
    </main>
  );
}