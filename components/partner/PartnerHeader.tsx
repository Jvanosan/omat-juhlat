"use client";

import {
  useEffect,
  useState,
} from "react";
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

type PartnerHeaderProfile = {
  company: string;
  status: string | null;
  logoUrl: string | null;
  slug: string | null;
};

const DEFAULT_PROFILE: PartnerHeaderProfile = {
  company: "Partneriyritys",
  status: null,
  logoUrl: null,
  slug: null,
};

export default function PartnerHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] =
    useState<PartnerHeaderProfile>(
      DEFAULT_PROFILE,
    );

  const [loggingOut, setLoggingOut] =
    useState(false);

  const currentPage =
    PARTNER_NAVIGATION.find((item) =>
      isPartnerRouteActive(
        pathname,
        item.href,
      ),
    );

  useEffect(() => {
    let active = true;

    async function loadPartnerProfile() {
      const {
        data: sessionData,
      } =
        await supabase.auth.getSession();

      const user =
        sessionData.session?.user;

      if (!user || !active) {
        return;
      }

      const { data, error } =
        await supabase
          .from("partners")
          .select(`
            company,
            status,
            logo_url,
            slug
          `)
          .eq("auth_user_id", user.id)
          .maybeSingle();

      if (!active) {
        return;
      }

      if (error) {
        console.error(
          "PARTNER HEADER PROFILE ERROR:",
          error,
        );

        return;
      }

      if (data) {
        setProfile({
          company:
            data.company ||
            "Partneriyritys",
          status: data.status,
          logoUrl: data.logo_url,
          slug: data.slug,
        });
      }
    }

    void loadPartnerProfile();

    return () => {
      active = false;
    };
  }, []);

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

  const profileInitial =
    profile.company
      .charAt(0)
      .toUpperCase() || "P";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e8ded0] bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8">
        <div className="flex min-h-14 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a773b]">
              OmatJuhlat Partner
            </p>

            <h1 className="mt-1 truncate text-lg font-bold text-[#211b16] sm:text-xl">
              {currentPage?.label ||
                "Hallintapaneeli"}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              aria-label="Avaa julkinen sivusto"
              title="Avaa julkinen sivusto"
              className="hidden min-h-11 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-4 text-sm font-bold text-[#62584f] transition hover:border-[#b48a45] hover:text-[#795a28] sm:inline-flex"
            >
              Julkinen sivusto ↗
            </Link>

            {profile.slug && (
              <Link
                href={`/partner/${encodeURIComponent(
                  profile.slug,
                )}`}
                aria-label="Näytä yritykseni julkinen profiili"
                title="Näytä julkinen profiili"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ded3c4] bg-[#fffdf9] transition hover:border-[#b48a45]"
              >
                👁️
              </Link>
            )}

            <div className="flex items-center gap-2 rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-1.5 sm:gap-3 sm:pr-4">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt=""
                  className="h-10 w-10 rounded-xl bg-white object-contain p-1"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b48a45] font-black text-white">
                  {profileInitial}
                </div>
              )}

              <div className="hidden max-w-40 sm:block">
                <p className="truncate text-sm font-bold text-[#211b16]">
                  {profile.company}
                </p>

                <StatusLabel
                  status={profile.status}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void handleLogout()
              }
              disabled={loggingOut}
              aria-label="Kirjaudu ulos"
              title="Kirjaudu ulos"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#edcaca] bg-[#fff7f7] text-[#a33d3d] transition hover:bg-[#fff0f0] disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      <div className="sticky top-[79px] z-30 border-b border-[#e8ded0] bg-[#fbf8f2]/95 px-3 py-3 backdrop-blur lg:hidden">
        <nav
          aria-label="Partnerin navigaatio"
          className="flex gap-2 overflow-x-auto pb-1"
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
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${
                    active
                      ? "border-[#d9b875] bg-[#b48a45] text-white shadow-sm"
                      : "border-[#e8ded0] bg-white text-[#62584f] hover:border-[#d8c7ad] hover:text-[#211b16]"
                  }`}
                >
                  <span aria-hidden="true">
                    {item.icon}
                  </span>

                  <span>
                    {item.shortLabel}
                  </span>
                </Link>
              );
            },
          )}
        </nav>
      </div>
    </>
  );
}

function StatusLabel({
  status,
}: {
  status: string | null;
}) {
  if (status === "approved") {
    return (
      <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#168365]">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-[#20a77c]"
        />

        Julkaistu
      </p>
    );
  }

  if (status === "pending") {
    return (
      <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#98743b]">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-[#d4a449]"
        />

        Tarkistuksessa
      </p>
    );
  }

  return (
    <p className="mt-0.5 text-xs font-semibold text-[#91877d]">
      Ei julkaistu
    </p>
  );
}