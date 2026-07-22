"use client";

import Link from "next/link";

import PartnerCard from "@/components/partner/PartnerCard";
import QuickAction from "@/components/partner/QuickAction";
import SectionHeader from "@/components/partner/SectionHeader";
import StatCard from "@/components/partner/StatCard";

import {
  DASHBOARD_QUICK_ACTIONS,
  getProfileCompletion,
  isPublishedPartner,
} from "@/components/partner/dashboard/dashboardUtils";

import type { DashboardStatItem } from "@/components/partner/dashboard/types";

import { usePartnerDashboard } from "./usePartnerDashboard";

export default function PartnerDashboardPage() {
  const {
    partner,
    stats,
    loading,
    errorMessage,
    reload,
  } = usePartnerDashboard();

  const profilePublished =
    isPublishedPartner(partner);

  const profileCompletion =
    getProfileCompletion(partner);

  const dashboardStats: DashboardStatItem[] =
    [
      {
        label: "Uudet tarjouspyynnöt",
        value: loading
          ? "…"
          : stats.newRequests,
        icon: "📥",
        href: "/partner/quotes",
        tone: "blue",
      },
      {
        label: "Lähetetyt tarjoukset",
        value: loading
          ? "…"
          : stats.sentOffers,
        icon: "💶",
        href: "/partner/quotes",
        tone: "gold",
      },
      {
        label: "Hyväksytyt tarjoukset",
        value: loading
          ? "…"
          : stats.acceptedOffers,
        icon: "🏆",
        href: "/partner/quotes",
        tone: "green",
      },
      {
        label: "Arvostelujen keskiarvo",
        value: loading
          ? "…"
          : stats.averageRating,
        icon: "⭐",
        href: "/partner/profile",
        tone: "rose",
      },
    ];

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      {errorMessage && (
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-2xl border border-[#edcaca] bg-[#fff3f3] p-5 text-[#a33d3d] sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-bold">
              Tietojen lataaminen epäonnistui
            </p>

            <p className="mt-1 text-sm leading-6">
              {errorMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void reload()
            }
            disabled={loading}
            className="shrink-0 rounded-xl border border-[#d99e9e] bg-white px-4 py-2 text-sm font-bold text-[#a33d3d] transition hover:bg-[#fffafa] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Ladataan..."
              : "Yritä uudelleen"}
          </button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-[2rem] border border-[#e3d6c4] bg-gradient-to-br from-white via-[#fffaf0] to-[#f8e9e7] p-6 shadow-[0_20px_55px_rgba(73,53,31,0.09)] sm:p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#efd7a9]/35 blur-3xl"
        />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a773b]">
              Partneriportaali
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#211b16] sm:text-4xl lg:text-5xl">
              {loading
                ? "Tervetuloa takaisin"
                : `Tervetuloa takaisin${
                    partner?.company
                      ? `, ${partner.company}`
                      : ""
                  }`}
              <span
                aria-hidden="true"
                className="ml-2"
              >
                👋
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#70675e] sm:text-lg">
              Hallitse yrityksesi profiilia,
              tarjouspyyntöjä, tarjouksia ja
              saatavuutta yhdestä paikasta.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/partner/quotes"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#b48a45] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f783a] hover:shadow-md"
              >
                Katso tarjouspyynnöt
              </Link>

              <Link
                href="/partner/profile"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8c7ad] bg-white px-5 py-3 text-sm font-bold text-[#795a28] transition hover:border-[#b48a45] hover:bg-[#fffdf9]"
              >
                Muokkaa profiilia
              </Link>

              {partner?.slug && (
                <Link
                  href={`/partner/${encodeURIComponent(
                    partner.slug,
                  )}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-[#62584f] transition hover:bg-white/70 hover:text-[#211b16]"
                >
                  Näytä julkinen profiili ↗
                </Link>
              )}
            </div>
          </div>

          <ProfileStatusCard
            loading={loading}
            published={profilePublished}
            status={partner?.status}
            completion={
              profileCompletion
            }
          />
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Yhteenveto"
          title="Yrityksesi tilanne"
          description="Tärkeimmät luvut molemmista tarjouspyyntöpoluista."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map(
            (stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                href={stat.href}
                tone={stat.tone}
                detail={
                  stat.label ===
                  "Uudet tarjouspyynnöt"
                    ? "Odottaa vastaustasi"
                    : stat.label ===
                        "Lähetetyt tarjoukset"
                      ? "Kaikki lähettämäsi tarjoukset"
                      : stat.label ===
                          "Hyväksytyt tarjoukset"
                        ? "Asiakkaiden vahvistamat"
                        : `${stats.reviewCount} ${
                            stats.reviewCount ===
                            1
                              ? "arvostelu"
                              : "arvostelua"
                          }`
                }
              />
            ),
          )}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Pikatoiminnot"
          title="Mitä haluat tehdä?"
          description="Siirry nopeasti tärkeimpiin partnerin toimintoihin."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {DASHBOARD_QUICK_ACTIONS.map(
            (action) => (
              <QuickAction
                key={action.href}
                title={action.title}
                description={
                  action.description
                }
                href={action.href}
                icon={action.icon}
              />
            ),
          )}
        </div>
      </section>

      <PartnerCard
        as="section"
        className="overflow-hidden"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a773b]">
              Profiilin näkyvyys
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#211b16] sm:text-2xl">
              {partner?.profile_completed
                ? "Pidä yritysprofiilisi ajan tasalla"
                : "Viimeistele yritysprofiilisi"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#70675e]">
              Laadukas kuvaus, oikeat
              toiminta-alueet, selkeät hinnat ja
              hyvät kuvat auttavat asiakasta
              valitsemaan yrityksesi.
            </p>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-[#62584f]">
                  Profiilin valmius
                </span>

                <span className="font-black text-[#168365]">
                  {loading
                    ? "…"
                    : `${profileCompletion} %`}
                </span>
              </div>

              <div
                className="h-2.5 overflow-hidden rounded-full bg-[#eee8df]"
                role="progressbar"
                aria-label="Profiilin valmius"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={
                  profileCompletion
                }
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#20a77c] to-[#64c7a8] transition-all"
                  style={{
                    width: `${profileCompletion}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/partner/profile"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#168365] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#116b53]"
          >
            Täydennä profiilia
          </Link>
        </div>
      </PartnerCard>
    </div>
  );
}

function ProfileStatusCard({
  loading,
  published,
  status,
  completion,
}: {
  loading: boolean;
  published: boolean;
  status: string | null | undefined;
  completion: number;
}) {
  const rejected =
    status?.trim().toLowerCase() ===
    "rejected";

  const styles = loading
    ? {
        border: "border-[#e8ded0]",
        background: "bg-white/75",
        dot: "bg-[#b8aa9d]",
        title: "text-[#62584f]",
      }
    : published
      ? {
          border: "border-[#b9dfd0]",
          background: "bg-[#edf8f3]",
          dot: "bg-[#20a77c]",
          title: "text-[#11634d]",
        }
      : rejected
        ? {
            border: "border-[#edcaca]",
            background: "bg-[#fff3f3]",
            dot: "bg-[#c85b5b]",
            title: "text-[#a33d3d]",
          }
        : {
            border: "border-[#ead29d]",
            background: "bg-[#fff8e8]",
            dot: "bg-[#d4a449]",
            title: "text-[#795a28]",
          };

  return (
    <div
      className={`w-full rounded-2xl border p-5 lg:max-w-sm ${styles.border} ${styles.background}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${styles.dot}`}
        />

        <div>
          <p
            className={`font-bold ${styles.title}`}
          >
            {loading
              ? "Tarkistetaan profiilia"
              : published
                ? "Profiili julkaistu"
                : rejected
                  ? "Profiili vaatii korjauksia"
                  : "Profiili tarkistuksessa"}
          </p>

          <p className="mt-1 text-sm leading-6 text-[#70675e]">
            {loading
              ? "Odota hetki..."
              : published
                ? "Yrityksesi näkyy asiakkaille Browse-sivulla."
                : rejected
                  ? "Tarkista profiilin tiedot ja lähetä se uudelleen tarkistettavaksi."
                  : completion < 100
                    ? `Täydennä vielä profiilisi. Valmius on ${completion} %.`
                    : "Profiilisi odottaa adminin hyväksyntää."}
          </p>
        </div>
      </div>
    </div>
  );
}