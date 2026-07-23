import {
  Suspense,
} from "react";

import PartnerCompleteClient from "./PartnerCompleteClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#fbf8f2] px-4 text-[#211b16]">
          <div
            role="status"
            className="rounded-3xl border border-[#e2d5c4] bg-white px-9 py-8 text-center shadow-[0_20px_60px_rgba(73,53,31,0.12)]"
          >
            <div
              aria-hidden="true"
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
            />

            <p className="mt-4 font-bold text-[#3f362f]">
              Valmistellaan partneritiliä...
            </p>
          </div>
        </main>
      }
    >
      <PartnerCompleteClient />
    </Suspense>
  );
}