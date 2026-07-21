"use client";

type AdminHeaderProps = {
  onLogout: () => void;
};

export default function AdminHeader({
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">
            OmatJuhlat Admin
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Hallintapaneeli
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Hallitse tarjouspyyntöjä, partnerihakemuksia,
            kumppaneita ja arvosteluja yhdestä paikasta.
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Kirjaudu ulos
        </button>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-3 sm:px-8">
        <p className="text-sm text-slate-500">
          🔐 Admin-oikeudet tarkistetaan turvallisesti
          palvelimella.
        </p>
      </div>
    </header>
  );
}