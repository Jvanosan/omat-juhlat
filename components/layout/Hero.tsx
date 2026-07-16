import Link from "next/link";
import Card from "@/components/ui/Card";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#fffaf0] to-[#fcefe8]">
      <div
        aria-hidden="true"
        className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#f4d9b1]/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#f3c8d6]/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#9a773b]">
            Juhlat alkavat tästä
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            Suunnittele unelmiesi juhlat{" "}
            <span className="text-[#b48a45]">yhdestä paikasta</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            Löydä juhlatilat, catering, kuvaajat, DJ:t ja muut tarvitsemasi
            palvelut helposti yhdellä tarjouspyynnöllä.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <Card className="group flex h-full flex-col">
            <div className="mb-5 text-4xl" aria-hidden="true">
              ✨
            </div>

            <h2 className="text-2xl font-bold text-gray-950">
              Anna meidän etsiä puolestasi
            </h2>

            <p className="mt-3 flex-1 leading-7 text-gray-600">
              Täytä yksi tarjouspyyntö, ja OmatJuhlat välittää sen
              automaattisesti sopiville palveluntarjoajille.
            </p>

            <Link
              href="/quote/new"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#c8a96a] px-6 py-3 font-semibold text-white transition duration-200 hover:bg-[#b89757] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96a] focus-visible:ring-offset-2"
            >
              Aloita tarjouspyyntö
            </Link>
          </Card>

          <Card className="group flex h-full flex-col">
            <div className="mb-5 text-4xl" aria-hidden="true">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-gray-950">
              Valitse kumppanit itse
            </h2>

            <p className="mt-3 flex-1 leading-7 text-gray-600">
              Selaa palveluntarjoajia, vertaile portfolioita ja lähetä
              tarjouspyyntö juuri valitsemillesi kumppaneille.
            </p>

            <Link
              href="/browse"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-[#c8a96a] bg-white px-6 py-3 font-semibold text-[#8a6a32] transition duration-200 hover:bg-[#f8f3e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96a] focus-visible:ring-offset-2"
            >
              Selaa palveluntarjoajia
            </Link>
          </Card>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-600">
          <span>✓ Maksuton tarjouspyyntö</span>
          <span>✓ Vahvistetut kumppanit</span>
          <span>✓ Vertaile tarjoukset helposti</span>
        </div>
      </div>
    </section>
  );
}