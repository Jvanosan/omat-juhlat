type SectionHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
};

export default function SectionHeader({
  title,
  description,
  eyebrow,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
            {eyebrow}
          </p>
        )}

        <h2
          className={`text-2xl font-bold tracking-tight text-[#211b16] sm:text-3xl ${
            eyebrow ? "mt-2" : ""
          }`}
        >
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#70675e] sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}