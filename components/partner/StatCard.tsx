import Link from "next/link";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: string;
  href?: string;
};

export default function StatCard({
  label,
  value,
  icon,
  href,
}: StatCardProps) {
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-zinc-500">{label}</p>

        <p className="mt-3 text-3xl font-bold tracking-tight">
          {value}
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800 text-xl transition group-hover:bg-zinc-700">
        <span aria-hidden="true">{icon}</span>
      </div>
    </div>
  );

  if (!href) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-800/80"
    >
      {content}
    </Link>
  );
}