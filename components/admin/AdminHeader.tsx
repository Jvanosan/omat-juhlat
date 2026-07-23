"use client";

import Link from "next/link";

type AdminHeaderProps = {
  onLogout: () => void;
};

export default function AdminHeader({
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="mb-8 overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_18px_50px_rgba(73,53,31,0.08)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#fffaf2] to-[#f8eee5] px-5 py-7 sm:px-8 sm:py-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#ead3ad]/35 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a47c3c]">
                OmatJuhlat Admin
              </p>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b9dfd0] bg-[#edf8f3] px-3 py-1 text-xs font-bold text-[#11634d]">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[#168365]"
                />

                Suojattu näkymä
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b16] sm:text-4xl">
              Hallintapaneeli
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#70675e] sm:text-base">
              Hallitse tarjouspyyntöjä,
              partnerihakemuksia, kumppaneita
              ja arvosteluja yhdestä
              selkeästä paikasta.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-4 py-3 text-sm font-bold text-[#62584f] shadow-sm transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
            >
              Avaa julkinen sivu ↗
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#edcaca] bg-[#fff4f4] px-4 py-3 text-sm font-bold text-[#a33d3d] transition hover:border-[#d99e9e] hover:bg-[#ffeaea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a33d3d] focus-visible:ring-offset-2"
            >
              Kirjaudu ulos
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 border-t border-[#eee5d9] bg-[#fffdf9] px-5 py-4 sm:items-center sm:px-8">
        <span
          aria-hidden="true"
          className="text-[#168365]"
        >
          🔐
        </span>

        <p className="text-xs leading-5 text-[#70675e] sm:text-sm">
          Admin-oikeudet tarkistetaan
          turvallisesti palvelimella.
          Asiakas- ja partneritietoja
          näytetään vain valtuutetulle
          ylläpitäjälle.
        </p>
      </div>
    </header>
  );
}