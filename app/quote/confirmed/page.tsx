import { Suspense } from "react";
import QuoteConfirmedClient from "./QuoteConfirmedClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Ladataan…</p>}>
      <QuoteConfirmedClient />
    </Suspense>
  );
}