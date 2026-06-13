import { Suspense } from "react";
import QuoteCompareClient from "./QuoteCompareClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Ladataan…</p>}>
      <QuoteCompareClient />
    </Suspense>
  );
}