import { Suspense } from "react";
import PartnerCompleteClient from "./PartnerCompleteClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Ladataan…</p>}>
      <PartnerCompleteClient />
    </Suspense>
  );
}