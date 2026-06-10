"use client";

import { useSearchParams } from "next/navigation";

export default function QuoteConfirmedPage() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");

  return (
    <main style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>✅ Varaus vahvistettu</h1>

      <p style={{ marginTop: 20 }}>
        Kiitos varauksestasi! Varaus on nyt vahvistettu onnistuneesti.
      </p>

      <p style={{ marginTop: 10 }}>
        Olemme lähettäneet vahvistuksen:
      </p>

      <ul>
        <li>📧 Asiakkaalle</li>
        <li>📧 Hyväksytyille partnereille</li>
        <li>📧 Adminille</li>
      </ul>

      <p style={{ marginTop: 20 }}>
        Varausnumero:
        <br />
        <strong>{quoteId}</strong>
      </p>

      <p style={{ marginTop: 20, color: "#555" }}>
        Partnerit ovat teihin yhteydessä tarvittaessa ennen tapahtumaa.
        Jos teillä on kysyttävää, voitte vastata vahvistusviestiin.
      </p>
    </main>
  );
}