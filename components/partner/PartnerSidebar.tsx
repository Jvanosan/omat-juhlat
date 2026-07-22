"use client";

import { useState } from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  isPartnerRouteActive,
  PARTNER_NAVIGATION,
} from "./partnerNavigation";

export default function PartnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "PARTNER LOGOUT ERROR:",
        error,
      );

      alert(
        "Uloskirjautuminen epäonnistui. Yritä uudelleen.",
      );

      setLoggingOut(false);
      return;
    }

    router.replace("/partner/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[#e8ded0] bg-white px-5 py-6 lg:flex lg:flex-col">
      <div className="mb-9">
        <Link
          href="/partner/dashboard"
          className="inline-flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ead8b8]/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c69a4b] to-[#a9782d] text-lg font-black text-white shadow-sm">
            OJ
          </div>

          <div>
            <p className="text-lg font-black tracking-tight text-[#211b16]">
              Omat
              <span className="text-[#b48a45]">
                Juhlat
              </span>
            </p>

            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#91877d]">
              Partneriportaali
            </p>
          </div>
        </Link>
      </div>

      <div className="mb-4 px-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a773b]">
          Hallinta
        </p>
      </div>

      <nav
        aria-label="Partnerin navigaatio"
        className="space-y-2"
      >
        {PARTNER_NAVIGATION.map(
          (item) => {
            const active =
              isPartnerRouteActive(
                pathname,
                item.href,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  active
                    ? "page"
                    : undefined
                }
                className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 transition ${
                  active
                    ? "border-[#e3c998] bg-[#fff7e8] text-[#795a28] shadow-sm"
                    : "border-transparent text-[#62584f] hover:border-[#eadfce] hover:bg-[#fbf8f2] hover:text-[#211b16]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                    active
                      ? "bg-white shadow-sm"
                      : "bg-[#f7f2ea] group-hover:bg-white"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-bold">
                    {item.label}
                  </span>

                  <span
                    className={`mt-0.5 block truncate text-xs ${
                      active
                        ? "text-[#98743b]"
                        : "text-[#91877d]"
                    }`}
                  >
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          },
        )}
      </nav>

      <div className="mt-auto space-y-2 border-t border-[#eee5d9] pt-5">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#62584f] transition hover:bg-[#f7f2ea] hover:text-[#211b16]"
        >
          <span aria-hidden="true">
            ↗️
          </span>

          <span>Näytä julkinen sivusto</span>
        </Link>

        <button
          type="button"
          onClick={() =>
            void handleLogout()
          }
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-[#a33d3d] transition hover:bg-[#fff0f0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true">
            🚪
          </span>

          <span>
            {loggingOut
              ? "Kirjaudutaan ulos..."
              : "Kirjaudu ulos"}
          </span>
        </button>
      </div>
    </aside>
  );
}