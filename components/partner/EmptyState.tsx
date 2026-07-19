import Link from "next/link";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-2xl">
        <span aria-hidden="true">{icon}</span>
      </div>

      <h2 className="mt-5 text-xl font-semibold">{title}</h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-500">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}