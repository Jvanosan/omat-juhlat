"use client";

import Link from "next/link";

type SelectionConfirmationBarProps = {
  selectedCount: number;
  confirmationHref: string | null;
  quoteStatus: string | null;
};

export default function SelectionConfirmationBar({
  selectedCount,
  confirmationHref,
  quoteStatus,
}: SelectionConfirmationBarProps) {
  const confirmed =
    quoteStatus === "confirmed" ||
    quoteStatus === "suljettu";

  if (
    selectedCount === 0 ||
    !confirmationHref ||
    confirmed
  ) {
    return null;
  }

  return (
    <aside
      aria-label="Valittujen tarjousten yhteenveto"
      className="sticky bottom-4 z-30 mt-8"
    >
      <div className="overflow-hidden rounded-3xl border border-[#d8c49e] bg-[#211b16] shadow-[0_20px_60px_rgba(33,27,22,0.25)]">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-4">
            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#b48a45] text-xl font-bold text-white"
            >
              {selectedCount}
            </div>

            <div>
              <p className="text-lg font-bold text-white">
                {selectedCount === 1
                  ? "Yksi palveluntarjoaja valittu"
                  : `${selectedCount} palveluntarjoajaa valittu`}
              </p>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#d8cec4]">
                Valitse ensin kaikki tarvitsemasi
                palvelut. Voit vielä vaihtaa
                valintojasi ennen lopullista
                vahvistamista.
              </p>
            </div>
          </div>

          <Link
            href={confirmationHref}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#b48a45] px-6 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#c39a55] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#211b16]"
          >
            Tarkista valitut palveluntarjoajat
            <span
              aria-hidden="true"
              className="ml-2"
            >
              →
            </span>
          </Link>
        </div>

        <div className="border-t border-white/10 bg-white/5 px-5 py-3 sm:px-6">
          <p className="text-xs leading-5 text-[#bfb3a8]">
            Tässä vaiheessa päivää ei ole vielä
            varattu eikä yhteystietojasi ole
            lähetetty. Tämä tapahtuu vasta
            lopullisen vahvistuksen jälkeen.
          </p>
        </div>
      </div>
    </aside>
  );
}