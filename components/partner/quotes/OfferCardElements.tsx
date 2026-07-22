export function OfferDetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eee5d9] bg-[#fffdf9] p-4">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#91877d]">
        <span aria-hidden="true">
          {icon}
        </span>

        {label}
      </dt>

      <dd className="mt-2 break-words font-semibold text-[#3f362f]">
        {value}
      </dd>
    </div>
  );
}

export function LockedOfferMessage({
  status,
}: {
  status: string | null | undefined;
}) {
  const normalized =
    status
      ?.trim()
      .toLowerCase() ?? "";

  const accepted = [
    "accepted",
    "selected",
    "confirmed",
    "valittu",
    "hyväksytty",
    "hyvaksytty",
    "vahvistettu",
  ].includes(normalized);

  const expired =
    normalized === "expired";

  return (
    <div
      className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
        accepted
          ? "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]"
          : expired
            ? "border-[#ead29d] bg-[#fff8e8] text-[#795a28]"
            : "border-[#edcaca] bg-[#fff3f3] text-[#a33d3d]"
      }`}
    >
      {accepted
        ? "🎉 Asiakas on hyväksynyt tarjouksesi. Tarjousta ei voi enää muokata."
        : expired
          ? "⏰ Tarjouksen voimassaoloaika on päättynyt."
          : "Tarjous on suljettu eikä sitä voi enää muokata."}
    </div>
  );
}

export function formatOfferPrice(
  value: unknown,
): string {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "Ei ilmoitettu";
  }

  return `${new Intl.NumberFormat(
    "fi-FI",
    {
      minimumFractionDigits:
        Number.isInteger(price)
          ? 0
          : 2,
      maximumFractionDigits: 2,
    },
  ).format(price)} €`;
}