"use client";

import Link from "next/link";

export function QuoteLoadingState() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fbf8f2] px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#e8ded0] bg-white p-8 text-center shadow-[0_18px_50px_rgba(73,53,31,0.09)]">
        <div
          aria-hidden="true"
          className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#ead8b8] border-t-[#b48a45]"
        />

        <h1 className="mt-5 text-xl font-bold text-[#211b16]">
          Ladataan tarjouksia
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#70675e]">
          Haemme tarjouspyyntösi ja
          palveluntarjoajien tarjoukset.
        </p>
      </div>
    </main>
  );
}

export function QuoteAccessDenied() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fbf8f2] px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-[#edcaca] bg-white p-8 text-center shadow-[0_18px_50px_rgba(73,53,31,0.09)] sm:p-10">
        <div
          aria-hidden="true"
          className="text-5xl"
        >
          🔒
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[#211b16]">
          Linkki ei ole voimassa
        </h1>

        <p className="mt-3 leading-7 text-[#70675e]">
          Tarjouspyyntöä ei löytynyt tai
          linkin turvallinen tunniste on
          virheellinen.
        </p>

        <p className="mt-3 text-sm leading-6 text-[#91877d]">
          Avaa tarjouspyyntö alkuperäisestä
          OmatJuhlat-sähköpostista. Älä muuta
          linkin osoitetta tai tunnistetta.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-3 font-bold text-white transition hover:bg-[#9f783a]"
        >
          Takaisin etusivulle
        </Link>
      </div>
    </main>
  );
}

export function QuoteErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fbf8f2] px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-[#edcaca] bg-white p-8 text-center shadow-[0_18px_50px_rgba(73,53,31,0.09)] sm:p-10">
        <div
          aria-hidden="true"
          className="text-5xl"
        >
          ⚠️
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[#211b16]">
          Tietojen lataaminen epäonnistui
        </h1>

        <p className="mt-3 leading-7 text-[#a33d3d]">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-3 font-bold text-white transition hover:bg-[#9f783a]"
        >
          Yritä uudelleen
        </button>
      </div>
    </main>
  );
}