import Link from "next/link";

export default function ConfirmationHero({
  backHref,
}: {
  backHref: string;
}) {
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
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center rounded-xl border border-[#d8c7ad] bg-white/80 px-4 py-2 text-sm font-bold text-[#795a28] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b48a45] hover:bg-white"
        >
          ← Palaa tarjouksiin ja muuta valintoja
        </Link>

        <div className="mt-7 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a773b]">
            Viimeinen vaihe
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#211b16] sm:text-5xl lg:text-6xl">
            Tarkista ja{" "}
            <span className="text-[#b48a45]">
              vahvista valintasi
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#70675e] sm:text-lg">
            Tarkista kaikki valitsemasi
            palveluntarjoajat, palvelut ja
            hinnat ennen lopullista
            vahvistamista.
          </p>

          <div className="mt-6 max-w-2xl rounded-2xl border border-[#ead29d] bg-[#fff8e8] p-4">
            <p className="text-sm font-bold text-[#795a28]">
              Valinnat eivät ole vielä
              lopullisia
            </p>

            <p className="mt-1 text-sm leading-6 text-[#806b48]">
              Voit palata tarjouksiin,
              valita lisää palveluita tai
              vaihtaa saman palvelun
              palveluntarjoajaa.
            </p>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#91877d]">
            Lopullisen vahvistamisen jälkeen
            valintoja ei voi enää muuttaa.
            Välitämme yhteystiedot
            osapuolille, ja sopimus sekä
            maksaminen hoidetaan suoraan
            palveluntarjoajien kanssa.
          </p>
        </div>
      </div>
    </section>
  );
}