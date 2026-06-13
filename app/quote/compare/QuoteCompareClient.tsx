"use client";

import { useSearchParams } from "next/navigation";

export default function QuoteCompareClient() {
  const searchParams = useSearchParams();
  const ids = searchParams.getAll("id");

  return (
    <main style={{ padding: 40 }}>
      <h1>📊 Vertaa tarjouksia</h1>
      {ids.length === 0 ? (
        <p>Ei valittuja tarjouksia.</p>
      ) : (
        <ul>
          {ids.map((id) => (
            <li key={id}>Tarjous ID: {id}</li>
          ))}
        </ul>
      )}
    </main>
  );
}