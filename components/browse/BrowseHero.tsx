import Link from "next/link";

export default function BrowseHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#e8ded0] bg-gradient-to-br from-[#fffdf9] via-[#fff7eb] to-[#f8e8e8]">
      <div
        aria-hidden="true"
        className="absolute -left-20 top-4 h-64 w-64 rounded-full bg-[#ead8b8]/45 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#d9a8b8]/25 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 sm:py-18 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex min-h-11 items-center rounded-xl border border-[#ddceb8] bg-white/80 px-4 py-2 text-sm font-semibold text-[#795a28] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b48a45] hover:bg-white"
          >
            ← Takaisin etusivulle
          </Link>

          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#9a773b]">
            Valitse palveluntarjoajat itse
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#211b16] sm:text-5xl lg:text-6xl">
            Löydä oikeat palvelut{" "}
            <span className="text-[#b48a45]">
              tapahtumaasi
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#70675e] sm:text-lg">
            Vertaa palveluntarjoajia, tarkista heidän
            saatavuutensa ja lähetä tarjouspyyntö suoraan
            valitsemillesi yrityksille.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#62584f]">
            <span>✓ Maksuton käyttää</span>
            <span>✓ Vahvistetut yritykset</span>
            <span>✓ Ei sitovaa varausta</span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-4 rotate-3 rounded-[2rem] bg-[#ead8b8]/55" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-2 shadow-[0_22px_60px_rgba(73,53,31,0.16)]">
            <img
              src="/juhlat.png"
              alt="Kauniisti katettu juhlatila"
              className="h-[330px] w-full rounded-[1.55rem] object-cover"
            />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur">
              <p className="font-bold text-[#211b16]">
                Kaikki juhlapalvelut yhdessä paikassa
              </p>

              <p className="mt-1 text-sm text-[#70675e]">
                Valitse yritykset ja pyydä tarjoukset helposti.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}