"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@omatjuhlat.fi" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin");
    } else {
      setError("Virheellinen sähköposti tai salasana");
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f8f8f8",
      fontFamily: "Arial",
    }}>
      <form onSubmit={handleLogin} style={{
        background: "#fff",
        padding: 40,
        borderRadius: 16,
        width: 360,
        border: "1px solid #eaeaea",
      }}>
        <h1>🔐 Kirjaudu</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Kirjaudu sisään
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
};