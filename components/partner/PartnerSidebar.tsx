"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/partner/dashboard",
    icon: "🏠",
  },
  {
    label: "Tarjouspyynnöt",
    href: "/partner/quotes",
    icon: "📨",
  },
  {
    label: "Profiili",
    href: "/partner/profile",
    icon: "👤",
  },
  {
    label: "Kalenteri",
    href: "/partner/calendar",
    icon: "📅",
  },
  {
    label: "Asetukset",
    href: "/partner/settings",
    icon: "⚙️",
  },
];

export default function PartnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 px-5 py-6 lg:flex lg:flex-col">
      <div className="mb-10">
        <Link
          href="/partner/dashboard"
          className="inline-flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-bold text-black">
            OJ
          </div>

          <div>
            <p className="text-lg font-semibold">OmatJuhlat</p>
            <p className="text-sm text-zinc-500">Partner Portal</p>
          </div>
        </Link>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-800 pt-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <span aria-hidden="true">🚪</span>
          <span>Kirjaudu ulos</span>
        </button>
      </div>
    </aside>
  );
}