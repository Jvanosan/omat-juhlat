export default function QuotePageHero({
  quoteStatus,
}: {
  quoteStatus: string | null;
}) {
  const confirmed =
    quoteStatus === "confirmed" ||
    quoteStatus === "suljettu";

  return (
    <section className="relative overflow-hidden border-b border-[#e8ded0] bg-gradient-to-br from-[#fffdf9] via-[#fff7eb] to-[#f8e8e8]">
      <div
        aria-hidden="true"
        className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#ead8b8]/45 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#d9a8b8]/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a773b]">
              OmatJuhlat-tarjoukset
            </p>

            {confirmed && (
              <span className="rounded-full border border-[#b9dfd0] bg-[#edf8f3] px-3 py-1 text-xs font-bold text-[#11634d]">
                ✓ Valinta vahvistettu
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#211b16] sm:text-5xl lg:text-6xl">
            Saapuneet{" "}
            <span className="text-[#b48a45]">
              tarjoukset
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#70675e] sm:text-lg">
            Vertaa hintoja, palveluntarjoajien
            arvosteluja ja tarjousten
            voimassaoloaikoja. Voit valita
            jokaiselle palvelulle sopivimman
            vaihtoehdon.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#62584f]">
            <span>✓ Turvallinen henkilökohtainen sivu</span>
            <span>✓ Ei sitovaa varausta ennen vahvistusta</span>
          </div>
        </div>
      </div>
    </section>
  );
}