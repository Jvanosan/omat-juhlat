"use client";

type Service = {
  id: string;
  label: string;
};

type ServiceSelectorProps = {
  services: Service[];
  selectedServices: string[];
  onToggle: (serviceId: string) => void;
};

export default function ServiceSelector({
  services,
  selectedServices,
  onToggle,
}: ServiceSelectorProps) {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a773b]">
            Valitse palvelut
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
            Mitä tarvitset juhliisi?
          </h2>

          <p className="mt-4 text-gray-600">
            Valitse yksi tai useampi palvelu. Voit muuttaa valintojasi ennen
            lähettämistä.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => {
            const selected = selectedServices.includes(service.id);

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onToggle(service.id)}
                aria-pressed={selected}
                className={[
                  "flex min-h-20 w-full items-center justify-between rounded-2xl border p-5 text-left",
                  "transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96a] focus-visible:ring-offset-2",
                  selected
                    ? "border-[#c8a96a] bg-[#fffaf0] shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#dcc69a] hover:shadow-sm",
                ].join(" ")}
              >
                <span
                  className={[
                    "font-semibold",
                    selected ? "text-[#7f602d]" : "text-gray-900",
                  ].join(" ")}
                >
                  {service.label}
                </span>

                <span
                  aria-hidden="true"
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-lg border-2 transition",
                    selected
                      ? "border-[#c8a96a] bg-[#c8a96a] text-white"
                      : "border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {selected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 7L5.7 9.7L11 4.4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Valittu: {selectedServices.length} palvelua
        </p>
      </div>
    </section>
  );
}