const STEPS = [
  {
    icon: "✓",
    title: "Vahvistamme valintasi",
    description:
      "Ilmoitamme valitulle palveluntarjoajalle vahvistuksesta.",
  },
  {
    icon: "📨",
    title: "Yhteystiedot välitetään",
    description:
      "Palveluntarjoaja saa tarvittavat yhteystietosi.",
  },
  {
    icon: "☎️",
    title: "Palveluntarjoaja ottaa yhteyttä",
    description:
      "Sovitte yhdessä tapahtuman yksityiskohdista.",
  },
  {
    icon: "🤝",
    title: "Sopimus suoraan yrityksen kanssa",
    description:
      "Sopimus ja maksaminen hoidetaan suoraan palveluntarjoajan kanssa.",
  },
];

export default function NextStepsCard() {
  return (
    <section className="rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-sm sm:p-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
          Vahvistamisen jälkeen
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
          Mitä tapahtuu seuraavaksi?
        </h2>
      </div>

      <ol className="mt-6 grid gap-4 sm:grid-cols-2">
        {STEPS.map(
          (step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-2xl border border-[#eee5d9] bg-[#fffdf9] p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4eadb] font-black text-[#8a672f]">
                {step.icon}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
                  Vaihe {index + 1}
                </p>

                <h3 className="mt-1 font-bold text-[#3f362f]">
                  {step.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#70675e]">
                  {step.description}
                </p>
              </div>
            </li>
          ),
        )}
      </ol>
    </section>
  );
}