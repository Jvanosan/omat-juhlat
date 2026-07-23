"use client";

type SubmitSectionProps = {
  loading: boolean;
  errorMsg: string;
  eventComplete: boolean;
  servicesComplete: boolean;
  onSubmit: () => void;
};

export default function SubmitSection({
  loading,
  errorMsg,
  eventComplete,
  servicesComplete,
  onSubmit,
}: SubmitSectionProps) {
  const readyToSubmit =
    eventComplete &&
    servicesComplete;

  return (
    <section className="bg-[#fbf8f2] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a47c3c]">
            Vaihe 3/3
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#211b16] sm:text-4xl">
            Tarkista ja lähetä
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#70675e] sm:text-base">
            Kun tiedot ovat kunnossa,
            lähetämme tarjouspyynnön
            sopiville OmatJuhlat-
            palveluntarjoajille.
          </p>
        </div>

        <div
          id="quote-submit-status"
          className="mb-5 grid gap-3 sm:grid-cols-2"
        >
          <CompletionItem
            complete={
              eventComplete
            }
            title="Tapahtuman tiedot"
            description={
              eventComplete
                ? "Pakolliset perustiedot on täytetty."
                : "Täytä kaikki pakolliset tapahtumatiedot."
            }
          />

          <CompletionItem
            complete={
              servicesComplete
            }
            title="Palveluvalinnat"
            description={
              servicesComplete
                ? "Vähintään yksi palvelu on valittu."
                : "Valitse vähintään yksi tarvitsemasi palvelu."
            }
          />
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-[#edcaca] bg-[#fff0f0] px-5 py-4 text-[#a33d3d]"
          >
            <span
              aria-hidden="true"
              className="text-lg"
            >
              ⚠️
            </span>

            <div>
              <p className="font-bold">
                Tarkista tarjouspyyntö
              </p>

              <p className="mt-1 text-sm leading-6">
                {errorMsg}
              </p>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_20px_60px_rgba(73,53,31,0.1)]">
          <div className="bg-gradient-to-br from-[#fffaf2] via-white to-[#f8eee5] px-5 py-8 text-center sm:px-8 sm:py-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#decba9] bg-white text-2xl shadow-sm">
              ✨
            </div>

            <h3 className="mt-5 text-2xl font-bold text-[#211b16] sm:text-3xl">
              Valmis pyytämään
              tarjoukset?
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#70675e] sm:text-base">
              Saat henkilökohtaisen
              turvallisen linkin, jonka
              kautta voit seurata,
              vertailla ja valita
              saapuneita tarjouksia.
            </p>
          </div>

          <div className="px-5 py-7 sm:px-8">
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading}
              className={`inline-flex min-h-14 w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(180,138,69,0.24)] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                readyToSubmit
                  ? "bg-[#b48a45] hover:-translate-y-0.5 hover:bg-[#9f783a]"
                  : "bg-[#9b8f82] hover:bg-[#83776c]"
              }`}
            >
              {loading
                ? "Lähetetään turvallisesti..."
                : "Lähetä tarjouspyyntö"}
            </button>

            {!readyToSubmit &&
              !errorMsg && (
                <p className="mt-3 text-center text-sm font-semibold text-[#795a28]">
                  Täydennä vielä yllä
                  näkyvät puuttuvat tiedot.
                </p>
              )}

            <div className="mt-7 grid gap-4 border-t border-[#eee5d9] pt-6 sm:grid-cols-3">
              <TrustItem
                icon="🔒"
                title="Turvallinen"
                description="Yhteystietojasi käsitellään luottamuksellisesti."
              />

              <TrustItem
                icon="📧"
                title="Helppo seurata"
                description="Saat turvallisen asiakaslinkin sähköpostiisi."
              />

              <TrustItem
                icon="🤝"
                title="Ei sitoumuksia"
                description="Tarjouspyyntö ei pakota hyväksymään tarjousta."
              />
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#91877d]">
              Lähettämällä pyynnön
              hyväksyt, että tietosi
              välitetään vain pyyntöön
              sopiville
              palveluntarjoajille.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompletionItem({
  complete,
  title,
  description,
}: {
  complete: boolean;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        complete
          ? "border-[#b9dfd0] bg-[#edf8f3]"
          : "border-[#ead29d] bg-[#fff8e8]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          complete
            ? "bg-[#168365] text-white"
            : "bg-[#d6a94f] text-white"
        }`}
      >
        {complete ? "✓" : "!"}
      </span>

      <div>
        <p
          className={`font-bold ${
            complete
              ? "text-[#11634d]"
              : "text-[#795a28]"
          }`}
        >
          {title}
        </p>

        <p
          className={`mt-1 text-xs leading-5 ${
            complete
              ? "text-[#41685d]"
              : "text-[#876e43]"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div
        aria-hidden="true"
        className="text-xl"
      >
        {icon}
      </div>

      <p className="mt-2 text-sm font-bold text-[#3f362f]">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-[#91877d]">
        {description}
      </p>
    </div>
  );
}