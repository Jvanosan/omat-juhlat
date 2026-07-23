"use client";

type Service = {
  id: string;
  label: string;
  icon?: string;
};

type ServiceSelectorProps = {
  services: readonly Service[];
  selectedServices: string[];

  onToggle: (
    serviceId: string,
  ) => void;
};

export default function ServiceSelector({
  services,
  selectedServices,
  onToggle,
}: ServiceSelectorProps) {
  return (
    <section className="border-y border-[#eee5d9] bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a47c3c]">
            Vaihe 2/3
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#211b16] sm:text-4xl">
            Mitä palveluita tarvitset?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#70675e] sm:text-base">
            Valitse yksi tai useampi
            palvelu. Pyyntö kohdistetaan
            vain valitsemiisi
            palvelukategorioihin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(
            (service) => {
              const selected =
                selectedServices.includes(
                  service.id,
                );

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() =>
                    onToggle(
                      service.id,
                    )
                  }
                  aria-pressed={
                    selected
                  }
                  className={`group relative flex min-h-32 w-full flex-col items-start justify-between overflow-hidden rounded-2xl border p-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b48a45] focus-visible:ring-offset-2 ${
                    selected
                      ? "border-[#c8a96a] bg-[#fff8e8] shadow-[0_10px_25px_rgba(180,138,69,0.13)]"
                      : "border-[#e8ded0] bg-[#fffdf9] hover:-translate-y-0.5 hover:border-[#d8c7ad] hover:shadow-sm"
                  }`}
                >
                  <div className="flex w-full items-start justify-between gap-4">
                    <span
                      aria-hidden="true"
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition ${
                        selected
                          ? "bg-white shadow-sm"
                          : "bg-[#fbf5e9] group-hover:bg-white"
                      }`}
                    >
                      {service.icon ||
                        "✨"}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        selected
                          ? "border-[#b48a45] bg-[#b48a45] text-white"
                          : "border-[#d7ccbf] bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  <span
                    className={`mt-5 font-bold ${
                      selected
                        ? "text-[#87652f]"
                        : "text-[#3f362f]"
                    }`}
                  >
                    {service.label}
                  </span>

                  {selected && (
                    <span className="mt-2 text-xs font-semibold text-[#a47c3c]">
                      Valittu
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>

        <div
          aria-live="polite"
          className={`mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold ${
            selectedServices.length >
            0
              ? "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]"
              : "border-[#ead29d] bg-[#fff8e8] text-[#795a28]"
          }`}
        >
          <span aria-hidden="true">
            {selectedServices.length >
            0
              ? "✓"
              : "○"}
          </span>

          {selectedServices.length ===
          0
            ? "Valitse vähintään yksi palvelu"
            : `Valittu ${
                selectedServices.length
              } ${
                selectedServices.length ===
                1
                  ? "palvelu"
                  : "palvelua"
              }`}
        </div>
      </div>
    </section>
  );
}