"use client";

import { useSearchParams } from "next/navigation";

export default function PartnerCompleteClient() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId");

  return (
    <main style={{ padding: 40 }}>
      <h1>🛠️ Täydennä profiilisi</h1>
      {!partnerId && <p>Partner ID puuttuu linkistä.</p>}
      {partnerId && <p>Partner ID: {partnerId}</p>}
    </main>
  );
}