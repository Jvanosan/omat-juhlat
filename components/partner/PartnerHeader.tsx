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

export default function PartnerHeader() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 px-5 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">
              OmatJuhlat Partner
            </p>

            <h1 className="text-lg font-semibold">
              Hallintapaneeli
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Ilmoitukset"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-lg transition hover:border-zinc-700 hover:bg-zinc-800"
            >
              🔔
            </button>

            <div className="hidden items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-semibold text-black">
                P
              </div>

              <div className="pr-2">
                <p className="text-sm font-medium">
                  Partneriyritys
                </p>

                <p className="text-xs text-emerald-400">
                  Julkaistu
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-3 lg:hidden">
        <nav className="flex gap-2 overflow-x-auto">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-500 text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}