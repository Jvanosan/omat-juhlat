"use client";

import { useSearchParams } from "next/navigation";

export default function QuoteConfirmedClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <main style={{ padding: 40 }}>
      <h1>✅ Tarjous vahvistettu</h1>
      {id && <p>Tarjous ID: {id}</p>}
    </main>
  );
}