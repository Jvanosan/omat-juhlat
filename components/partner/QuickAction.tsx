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
      className="group flex min-h-full items-start gap-4 rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#d8c7ad] hover:shadow-[0_16px_35px_rgba(73,53,31,0.09)] sm:p-6"
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-xl transition group-hover:scale-105 group-hover:bg-[#f9e7c4]"
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-[#211b16] transition group-hover:text-[#795a28]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-[#70675e]">
          {description}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="mt-2 shrink-0 text-lg text-[#b5a99c] transition group-hover:translate-x-1 group-hover:text-[#9a773b]"
      >
        →
      </span>
    </Link>
  );
}