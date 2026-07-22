import Link from "next/link";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: string;
  href?: string;
  tone?:
    | "gold"
    | "blue"
    | "green"
    | "rose";
  detail?: string;
};

const TONE_STYLES = {
  gold: {
    icon: "bg-[#fff4db] text-[#9a6b20]",
    value: "text-[#9a6b20]",
  },

  blue: {
    icon: "bg-[#edf4ff] text-[#3564a8]",
    value: "text-[#3564a8]",
  },

  green: {
    icon: "bg-[#eaf8f2] text-[#168365]",
    value: "text-[#168365]",
  },

  rose: {
    icon: "bg-[#fff0f2] text-[#a44f60]",
    value: "text-[#a44f60]",
  },
} as const;

export default function StatCard({
  label,
  value,
  icon,
  href,
  tone = "gold",
  detail,
}: StatCardProps) {
  const styles =
    TONE_STYLES[tone];

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div
          aria-hidden="true"
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${styles.icon}`}
        >
          {icon}
        </div>

        {href && (
          <span
            aria-hidden="true"
            className="text-lg text-[#b5a99c] transition group-hover:translate-x-1 group-hover:text-[#9a773b]"
          >
            →
          </span>
        )}
      </div>

      <p
        className={`mt-6 text-3xl font-black tracking-tight sm:text-4xl ${styles.value}`}
      >
        {value}
      </p>

      <p className="mt-2 text-sm font-bold text-[#3f362f]">
        {label}
      </p>

      {detail && (
        <p className="mt-1 text-xs leading-5 text-[#91877d]">
          {detail}
        </p>
      )}
    </>
  );

  const classes =
    "group block rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#d8c7ad] hover:shadow-[0_16px_35px_rgba(73,53,31,0.09)] sm:p-6";

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={classes}>
      {content}
    </div>
  );
}