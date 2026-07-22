import type { ReactNode } from "react";

type ContentSectionProps = {
  title: string;
  icon: string;
  children: ReactNode;
};

export function ContentSection({
  title,
  icon,
  children,
}: ContentSectionProps) {
  return (
    <section className="rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-sm sm:p-7">
      <h2 className="flex items-center gap-3 text-2xl font-bold text-[#211b16]">
        <span aria-hidden="true">
          {icon}
        </span>

        {title}
      </h2>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  icon: string;
};

export function InfoRow({
  label,
  value,
  icon,
}: InfoRowProps) {
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <span
        aria-hidden="true"
        className="mt-0.5"
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-[#3f362f]">
          {value}
        </p>
      </div>
    </div>
  );
}

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
};

export function ExternalLink({
  href,
  children,
}: ExternalLinkProps) {
  const safeHref = normalizeExternalUrl(
    href,
  );

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-[#e8ded0] bg-[#fffdf9] px-4 py-3 text-sm font-bold text-[#795a28] transition hover:-translate-y-0.5 hover:border-[#b48a45] hover:bg-[#fff8ec]"
    >
      {children}{" "}
      <span aria-hidden="true">→</span>
    </a>
  );
}

function normalizeExternalUrl(
  value: string,
): string {
  const trimmedValue = value.trim();

  if (
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("http://")
  ) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}