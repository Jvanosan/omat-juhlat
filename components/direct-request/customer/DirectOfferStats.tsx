export default function DirectOfferStats({
  receivedOffers,
  selectableOffers,
}: {
  receivedOffers: number;
  selectableOffers: number;
}) {
  return (
    <section
      aria-label="Tarjousten yhteenveto"
      className="grid gap-4 sm:grid-cols-2"
    >
      <StatCard
        value={receivedOffers}
        label={
          receivedOffers === 1
            ? "Saapunut tarjous"
            : "Saapunutta tarjousta"
        }
        icon="📨"
        classes="border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]"
      />

      <StatCard
        value={selectableOffers}
        label="Valittavissa"
        icon="✓"
        classes="border-[#ead29d] bg-[#fff8e8] text-[#795a28]"
      />
    </section>
  );
}

function StatCard({
  value,
  label,
  icon,
  classes,
}: {
  value: number;
  label: string;
  icon: string;
  classes: string;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${classes}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-black">
            {value}
          </p>

          <p className="mt-1 text-sm font-semibold">
            {label}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="text-2xl"
        >
          {icon}
        </span>
      </div>
    </div>
  );
}