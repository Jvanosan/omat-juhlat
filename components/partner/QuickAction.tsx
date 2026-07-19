import Link from "next/link";

type QuickActionProps = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export default function QuickAction({
  title,
  description,
  href,
  icon,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-emerald-500/30 hover:bg-zinc-800/80"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl">
        <span aria-hidden="true">{icon}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">{title}</h3>

          <span className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-emerald-400">
            →
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          {description}
        </p>
      </div>
    </Link>
  );
}