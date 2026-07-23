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
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a773b]">
              OmatJuhlat-tarjoukset
            </p>

            {confirmed && (
              <span className="rounded-full border border-[#b9dfd0] bg-[#edf8f3] px-3 py-1 text-xs font-bold text-[#11634d]">
                ✓ Valinnat vahvistettu
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#211b16] sm:text-5xl lg:text-6xl">
            Saapuneet{" "}
            <span className="text-[#b48a45]">
              tarjoukset
            </span>
          </h1>

          {confirmed ? (
            <div className="mt-6 max-w-3xl rounded-3xl border border-[#b9dfd0] bg-[#edf8f3] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#11634d]">
                Valintasi on vahvistettu
              </h2>

              <p className="mt-2 leading-7 text-[#41685d]">
                Valituille palveluntarjoajille on
                ilmoitettu ja tapahtumapäivä on
                varattu heidän kalentereistaan.
                Palveluntarjoajat ottavat sinuun
                yhteyttä yksityiskohtien sopimiseksi.
              </p>

              <p className="mt-3 text-sm leading-6 text-[#5c7c70]">
                Tähän tarjouspyyntöön ei voi enää
                lisätä tai vaihtaa
                palveluntarjoajia.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#70675e] sm:text-lg">
                Vertaa saamiasi tarjouksia ja valitse
                yksi palveluntarjoaja jokaiseen
                tarvitsemaasi palveluun. Voit vielä
                vaihtaa valintoja ennen lopullista
                vahvistamista.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <StepCard
                  number="1"
                  title="Valitse tarjoukset"
                  description="Valitse sopivin tarjous jokaisesta tarvitsemastasi palvelusta."
                />

                <StepCard
                  number="2"
                  title="Tarkista valinnat"
                  description="Varmista, että olet valinnut kaikki tarvitsemasi palvelut."
                />

                <StepCard
                  number="3"
                  title="Vahvista lopuksi"
                  description="Vasta lopullinen vahvistus varaa päivän ja lähettää yhteystiedot."
                />
              </div>

              <div className="mt-6 rounded-2xl border border-[#ead29d] bg-[#fff8e8] p-4 text-sm leading-6 text-[#795a28]">
                <strong>Hyvä tietää:</strong> Tarjouksen
                valitseminen tällä sivulla on alustava
                valinta. Päivää ei vielä varata eikä
                yhteystietojasi lähetetä
                palveluntarjoajalle. Saat tarkistaa
                kaikki valintasi ennen lopullista
                vahvistamista.
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8ded0] bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b48a45] text-sm font-black text-white">
        {number}
      </div>

      <h2 className="mt-4 font-bold text-[#211b16]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#70675e]">
        {description}
      </p>
    </div>
  );
}