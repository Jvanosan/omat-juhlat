"use client";

import type {
  KeyboardEvent,
  MouseEvent,
} from "react";

import { useRouter } from "next/navigation";

type Partner = {
  id: string;
  company: string;
  area: string;
  services: unknown;
  images?: string | null;
  slug: string | null;
};

export type PartnerAvailability =
  | "unknown"
  | "loading"
  | "available"
  | "unavailable";

type PartnerCardProps = {
  company: Partner;
  checked: boolean;
  normalizedServices: string[];
  availability: PartnerAvailability;
  onToggle: () => void;
};

export default function PartnerCard({
  company,
  checked,
  normalizedServices,
  availability,
  onToggle,
}: PartnerCardProps) {
  const router = useRouter();

  const images =
    company.images
      ?.split(",")
      .map((image) => image.trim())
      .filter(Boolean) ?? [];

  const primaryImage = images[0] ?? null;
  const unavailable =
    availability === "unavailable";
  const checking =
    availability === "loading";

  function openPartnerProfile() {
    if (!company.slug) return;

    router.push(
      `/partner/${encodeURIComponent(
        company.slug,
      )}`,
    );
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLElement>,
  ) {
    if (!company.slug) return;

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openPartnerProfile();
    }
  }

  function handleToggle(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    if (unavailable || checking) {
      return;
    }

    onToggle();
  }

  function getCardClasses() {
    if (unavailable) {
      return [
        "border-[#edcaca]",
        "bg-[#fff7f7]",
        "opacity-85",
      ].join(" ");
    }

    if (checked) {
      return [
        "border-[#72bca2]",
        "bg-[#f1faf6]",
        "shadow-[0_18px_45px_rgba(22,131,101,0.14)]",
        "ring-2",
        "ring-[#b9dfd0]",
      ].join(" ");
    }

    if (availability === "available") {
      return [
        "border-[#c7e4d9]",
        "bg-white",
        "hover:border-[#72bca2]",
      ].join(" ");
    }

    return [
      "border-[#e8ded0]",
      "bg-white",
      "hover:border-[#d1ba96]",
    ].join(" ");
  }

  function getButtonClasses() {
    if (unavailable) {
      return [
        "cursor-not-allowed",
        "border-[#e3aaaa]",
        "bg-[#fff0f0]",
        "text-[#a33d3d]",
      ].join(" ");
    }

    if (checking) {
      return [
        "cursor-wait",
        "border-[#ead29d]",
        "bg-[#fff8e8]",
        "text-[#795a28]",
      ].join(" ");
    }

    if (checked) {
      return [
        "border-[#168365]",
        "bg-[#168365]",
        "text-white",
        "hover:bg-[#116b53]",
      ].join(" ");
    }

    return [
      "border-[#d8c7ad]",
      "bg-white",
      "text-[#795a28]",
      "hover:border-[#b48a45]",
      "hover:bg-[#fff8ec]",
    ].join(" ");
  }

  return (
    <article
      role={company.slug ? "link" : undefined}
      tabIndex={company.slug ? 0 : -1}
      onClick={openPartnerProfile}
      onKeyDown={handleKeyDown}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border transition duration-200 ${getCardClasses()} ${
        company.slug
          ? "cursor-pointer"
          : "cursor-default"
      } ${
        !unavailable
          ? "hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(73,53,31,0.12)]"
          : ""
      }`}
    >
      <button
        type="button"
        disabled={unavailable || checking}
        onClick={handleToggle}
        className={`absolute right-3 top-3 z-10 inline-flex min-h-10 items-center justify-center rounded-full border px-3.5 py-2 text-xs font-bold shadow-md backdrop-blur transition ${getButtonClasses()}`}
        aria-pressed={checked}
        aria-label={
          unavailable
            ? `${company.company} ei ole saatavilla`
            : checked
              ? `Poista ${company.company} valituista`
              : `Valitse ${company.company}`
        }
      >
        {checking
          ? "Tarkistetaan..."
          : unavailable
            ? "Ei vapaa"
            : checked
              ? "✓ Valittu"
              : "Valitse"}
      </button>

      <div className="relative overflow-hidden bg-[#f3ede4]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${company.company} – palveluntarjoajan kuva`}
            loading="lazy"
            className={`h-48 w-full object-cover transition duration-500 sm:h-52 ${
              unavailable
                ? "grayscale-[45%]"
                : "group-hover:scale-[1.03]"
            }`}
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#f6ecdc] to-[#f5e8ea] text-center sm:h-52">
            <div>
              <div
                aria-hidden="true"
                className="text-4xl"
              >
                ✨
              </div>

              <p className="mt-2 text-sm font-medium text-[#91877d]">
                Ei vielä kuvaa
              </p>
            </div>
          </div>
        )}

        {images.length > 1 && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-bold text-[#51463d] shadow-sm backdrop-blur">
            📷 {images.length} kuvaa
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="pr-2 text-xl font-bold text-[#211b16] transition group-hover:text-[#8a672f]">
          {company.company}
        </h3>

        <p className="mt-2 text-sm font-medium text-[#70675e]">
          📍 {company.area || "Aluetta ei ilmoitettu"}
        </p>

        {normalizedServices.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {normalizedServices
              .slice(0, 3)
              .map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-[#e5d8c5] bg-[#fff9ef] px-3 py-1 text-xs font-semibold text-[#795a28]"
                >
                  {service}
                </span>
              ))}

            {normalizedServices.length > 3 && (
              <span className="rounded-full border border-[#e8ded0] bg-[#f8f5f0] px-3 py-1 text-xs font-semibold text-[#70675e]">
                +{normalizedServices.length - 3}
              </span>
            )}
          </div>
        )}

        <AvailabilityBadge
          availability={availability}
        />

        {company.slug && (
          <p className="mt-auto pt-5 text-sm font-bold text-[#8a672f] transition group-hover:text-[#b48a45]">
            Näytä yrityksen profiili →
          </p>
        )}
      </div>
    </article>
  );
}

function AvailabilityBadge({
  availability,
}: {
  availability: PartnerAvailability;
}) {
  const content = {
    unknown: {
      icon: "📅",
      label:
        "Valitse päivä nähdäksesi saatavuuden",
      classes:
        "border-[#ded3c4] bg-[#f8f5f0] text-[#70675e]",
    },

    loading: {
      icon: "⏳",
      label: "Tarkistetaan saatavuutta...",
      classes:
        "border-[#ead29d] bg-[#fff8e8] text-[#795a28]",
    },

    available: {
      icon: "✓",
      label: "Vapaa valittuna päivänä",
      classes:
        "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]",
    },

    unavailable: {
      icon: "✕",
      label: "Ei saatavilla valittuna päivänä",
      classes:
        "border-[#edcaca] bg-[#fff0f0] text-[#a33d3d]",
    },
  }[availability];

  return (
    <span
      className={`mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${content.classes}`}
    >
      <span aria-hidden="true">
        {content.icon}
      </span>

      {content.label}
    </span>
  );
}