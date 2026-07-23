import Link from "next/link";

export default function ApplicationSuccess() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#fbf8f2] px-4 py-12 text-[#211b16] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-[#d8e6dd] bg-white shadow-[0_24px_70px_rgba(73,53,31,0.12)]">
          <div className="bg-gradient-to-br from-[#edf8f3] via-white to-[#fbf5e9] px-6 py-10 text-center sm:px-10 sm:py-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#b9dfd0] bg-white text-4xl shadow-sm">
              ✅
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#168365]">
              Hakemus lähetetty
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b16] sm:text-4xl">
              Kiitos hakemuksestasi!
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#70675e]">
              Kumppanihakemuksesi on
              vastaanotettu ja tallennettu
              turvallisesti. Käymme sen läpi
              mahdollisimman pian.
            </p>
          </div>

          <div className="space-y-6 px-6 py-8 sm:px-10">
            <section>
              <h2 className="text-lg font-bold text-[#211b16]">
                Mitä tapahtuu seuraavaksi?
              </h2>

              <div className="mt-5 space-y-5">
                <NextStep
                  number="1"
                  title="Tarkistamme hakemuksen"
                  description="Käymme yrityksen tiedot ja palvelut läpi yksilöllisesti."
                />

                <NextStep
                  number="2"
                  title="Saat päätöksen sähköpostilla"
                  description="Olemme yhteydessä ilmoittamaasi sähköpostiosoitteeseen yleensä noin viikon kuluessa."
                />

                <NextStep
                  number="3"
                  title="Viimeistelet yritysprofiilin"
                  description="Hyväksymisen jälkeen saat ohjeet kirjautumiseen ja profiilin julkaisemiseen."
                />
              </div>
            </section>

            <div className="rounded-2xl border border-[#e8ded0] bg-[#fffaf2] p-5">
              <p className="text-sm leading-6 text-[#70675e]">
                Käsittelyaika voi vaihdella
                hakemusmäärän mukaan.
                Hakemuksen lähettäminen ei
                vielä sido yritystäsi
                kumppanuuteen.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#b48a45] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9f783a]"
              >
                Palaa etusivulle
              </Link>

              <Link
                href="/browse"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-5 py-3 text-sm font-bold text-[#62584f] transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
              >
                Selaa palveluntarjoajia
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function NextStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf8f3] text-sm font-bold text-[#11634d]">
        {number}
      </div>

      <div>
        <h3 className="font-bold text-[#3f362f]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-[#70675e]">
          {description}
        </p>
      </div>
    </div>
  );
}