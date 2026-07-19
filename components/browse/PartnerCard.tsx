"use client";

import { useRouter } from "next/navigation";

type Partner = {
  id: string;
  company: string;
  area: string;
  services: unknown;
  images?: string | null;
  slug: string | null;
};

type PartnerCardProps = {
  company: Partner;
  checked: boolean;
  normalizedServices: string[];
  onToggle: () => void;
};

export default function PartnerCard({
  company,
  checked,
  normalizedServices,
  onToggle,
}: PartnerCardProps) {
  const router = useRouter();

  const images =
    company.images
      ?.split(",")
      .map((image) => image.trim())
      .filter(Boolean) ?? [];

  function openPartnerProfile() {
    if (!company.slug) return;

    router.push(`/partner/${encodeURIComponent(company.slug)}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!company.slug) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPartnerProfile();
    }
  }

  return (
    <div
      role={company.slug ? "link" : undefined}
      tabIndex={company.slug ? 0 : -1}
      onClick={openPartnerProfile}
      onKeyDown={handleKeyDown}
      className={`group relative overflow-hidden rounded-2xl border transition-all ${
        company.slug ? "cursor-pointer" : "cursor-default"
      } ${
        checked
          ? "scale-[1.02] border-emerald-500 bg-emerald-950/40 shadow-lg"
          : "border-zinc-800 bg-zinc-900 hover:scale-[1.01] hover:border-zinc-700 hover:shadow-lg"
      }`}
    >
      {checked && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white shadow-md">
          ✓ Valittu
        </div>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={`absolute right-3 top-3 z-10 rounded-full border px-3 py-1.5 text-xs font-medium shadow-md transition ${
          checked
            ? "border-emerald-400 bg-emerald-500 text-white hover:bg-emerald-400"
            : "border-zinc-600 bg-zinc-950/90 text-zinc-200 hover:border-emerald-500 hover:text-emerald-400"
        }`}
        aria-pressed={checked}
        aria-label={
          checked
            ? `Poista ${company.company} valituista`
            : `Valitse ${company.company}`
        }
      >
        {checked ? "✓ Valittu" : "Valitse"}
      </button>

      {images.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto p-2">
          {images.map((image, index) => (
            <img
              key={`${company.id}-${index}`}
              src={image}
              alt={`${company.company}, kuva ${index + 1}`}
              loading="lazy"
              className="h-24 w-32 flex-none rounded-lg object-cover transition duration-300 group-hover:brightness-110"
            />
          ))}
        </div>
      ) : (
        <div className="flex h-28 items-center justify-center bg-zinc-800 text-sm text-zinc-500">
          Ei kuvaa
        </div>
      )}

      <div className="p-4">
        <span className="block font-medium text-white transition group-hover:text-emerald-400">
          {company.company}
        </span>

        <p className="mt-1 text-sm text-zinc-400">
          📍 {company.area}
        </p>

        {normalizedServices.length > 0 && (
          <p className="mt-1 text-sm text-zinc-500">
            {normalizedServices.join(", ")}
          </p>
        )}

        {company.slug && (
          <p className="mt-3 text-xs font-medium text-zinc-400 transition group-hover:text-white">
            Näytä profiili →
          </p>
        )}
      </div>
    </div>
  );
}