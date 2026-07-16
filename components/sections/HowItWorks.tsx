import Card from "@/components/ui/Card";

const STEPS = [
  {
    number: "01",
    title: "Kerro juhlastasi",
    description:
      "Täytä tapahtuman perustiedot, kuten päivämäärä, paikkakunta, vierasmäärä ja tarvitsemasi palvelut.",
  },
  {
    number: "02",
    title: "Saat tarjouksia",
    description:
      "Sopivat palveluntarjoajat lähettävät omat tarjouksensa suoraan OmatJuhlat-palveluun.",
  },
  {
    number: "03",
    title: "Vertaa rauhassa",
    description:
      "Tutustu hintoihin, sisältöihin, portfolioihin ja ehtoihin yhdessä selkeässä näkymässä.",
  },
  {
    number: "04",
    title: "Valitse sopivimmat",
    description:
      "Valitse yksi kumppani jokaiseen tarvitsemaasi palvelukategoriaan ja viimeistele juhlat.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a773b]">
            Helppo tapa järjestää juhlat
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Näin OmatJuhlat toimii
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
            Yksi tarjouspyyntö riittää. OmatJuhlat auttaa sinua löytämään,
            vertailemaan ja valitsemaan sopivat palveluntarjoajat.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Card key={step.number} className="h-full">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8f3e8] text-sm font-bold text-[#8a6a32]">
                {step.number}
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-950">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}