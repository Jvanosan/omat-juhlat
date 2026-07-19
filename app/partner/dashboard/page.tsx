"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PartnerCard from "@/components/partner/PartnerCard";
import QuickAction from "@/components/partner/QuickAction";
import SectionHeader from "@/components/partner/SectionHeader";
import StatCard from "@/components/partner/StatCard";

type PartnerData = {
  id: string;
  company: string | null;
  status: string | null;
  verified: boolean | null;
  profile_completed: boolean | null;
  profile_completion: number | null;
  published_at: string | null;
  average_rating: number | string | null;
  review_count: number | null;
};

type DashboardStats = {
  newRequests: number;
  sentOffers: number;
  acceptedOffers: number;
  averageRating: string;
};

const quickActions = [
  {
    title: "Muokkaa profiilia",
    description: "Päivitä yrityksen tiedot, palvelut ja kuvaus.",
    href: "/partner/profile",
    icon: "✏️",
  },
  {
    title: "Hallitse tarjouspyyntöjä",
    description: "Katso uusia pyyntöjä ja lähetä tarjouksia.",
    href: "/partner/quotes",
    icon: "📨",
  },
  {
    title: "Päivitä kalenteri",
    description: "Merkitse vapaat ja varatut päivät.",
    href: "/partner/calendar",
    icon: "📅",
  },
  {
    title: "Asetukset",
    description: "Hallitse käyttäjätiliä ja ilmoituksia.",
    href: "/partner/settings",
    icon: "⚙️",
  },
];

function normalizeStatus(status: string | null | undefined) {
  return status?.trim().toLowerCase() ?? "";
}

function isNewRequestStatus(status: string | null | undefined) {
  const normalizedStatus = normalizeStatus(status);

  return [
    "",
    "new",
    "pending",
    "open",
    "sent",
    "waiting",
    "uusi",
    "odottaa",
    "avoin",
  ].includes(normalizedStatus);
}

function isAcceptedOfferStatus(status: string | null | undefined) {
  const normalizedStatus = normalizeStatus(status);

  return [
    "accepted",
    "approved",
    "won",
    "confirmed",
    "hyväksytty",
    "hyvaksytty",
    "vahvistettu",
  ].includes(normalizedStatus);
}

function isPublishedPartner(partner: PartnerData | null) {
  if (!partner) {
    return false;
  }

  const normalizedStatus = normalizeStatus(partner.status);

  return (
    partner.verified === true ||
    Boolean(partner.published_at) ||
    ["active", "approved", "published", "hyväksytty", "hyvaksytty"].includes(
      normalizedStatus,
    )
  );
}

export default function PartnerDashboardPage() {
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    newRequests: 0,
    sentOffers: 0,
    acceptedOffers: 0,
    averageRating: "–",
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          if (isMounted) {
            setErrorMessage(
              "Kirjaudu partneritilille nähdäksesi hallintapaneelin tiedot.",
            );
          }

          return;
        }

        const { data: partnerData, error: partnerError } = await supabase
          .from("partners")
          .select(
            `
              id,
              company,
              status,
              verified,
              profile_completed,
              profile_completion,
              published_at,
              average_rating,
              review_count
            `,
          )
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (partnerError) {
          throw partnerError;
        }

        if (!partnerData) {
          if (isMounted) {
            setErrorMessage(
              "Kirjautuneelle käyttäjälle ei löytynyt partneriprofiilia.",
            );
          }

          return;
        }

        const currentPartner = partnerData as PartnerData;

        const [
          quotePartnersResult,
          offersResult,
        ] = await Promise.all([
          supabase
            .from("quote_partners")
            .select("id, status")
            .eq("partner_id", currentPartner.id),

          supabase
            .from("offers")
            .select("id, status")
            .eq("partner_id", currentPartner.id),
        ]);

        if (quotePartnersResult.error) {
          throw quotePartnersResult.error;
        }

        if (offersResult.error) {
          throw offersResult.error;
        }

        const quotePartnerRows = quotePartnersResult.data ?? [];
        const offerRows = offersResult.data ?? [];

        const newRequests = quotePartnerRows.filter((row) =>
          isNewRequestStatus(row.status),
        ).length;

        const sentOffers = offerRows.length;

        const acceptedOffers = offerRows.filter((row) =>
          isAcceptedOfferStatus(row.status),
        ).length;

        const numericAverageRating = Number(currentPartner.average_rating);

        const averageRating =
          Number.isFinite(numericAverageRating) && numericAverageRating > 0
            ? numericAverageRating.toFixed(1)
            : "–";

        if (isMounted) {
          setPartner(currentPartner);

          setStats({
            newRequests,
            sentOffers,
            acceptedOffers,
            averageRating,
          });
        }
      } catch (error) {
        console.error("Partner dashboard loading failed:", error);

        if (isMounted) {
          setErrorMessage(
            "Dashboardin tietojen lataaminen epäonnistui. Yritä päivittää sivu.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const dashboardStats = [
    {
      label: "Uudet tarjouspyynnöt",
      value: loading ? "…" : stats.newRequests,
      icon: "📥",
      href: "/partner/quotes",
    },
    {
      label: "Lähetetyt tarjoukset",
      value: loading ? "…" : stats.sentOffers,
      icon: "💰",
      href: "/partner/quotes",
    },
    {
      label: "Hyväksytyt tarjoukset",
      value: loading ? "…" : stats.acceptedOffers,
      icon: "🏆",
      href: "/partner/quotes",
    },
    {
      label: "Arvostelujen keskiarvo",
      value: loading ? "…" : stats.averageRating,
      icon: "⭐",
      href: "/partner/profile",
    },
  ];

  const profileIsPublished = isPublishedPartner(partner);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-200"
        >
          {errorMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
              Partner Portal
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {loading
                ? "Tervetuloa takaisin 👋"
                : `Tervetuloa takaisin${
                    partner?.company ? `, ${partner.company}` : ""
                  } 👋`}
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
              Hallitse yrityksesi profiilia, tarjouspyyntöjä ja tulevia
              varauksia yhdestä paikasta.
            </p>
          </div>

          <div
            className={`rounded-2xl border px-5 py-4 ${
              profileIsPublished
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-amber-500/20 bg-amber-500/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  profileIsPublished
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />

              <div>
                <p
                  className={`text-sm font-semibold ${
                    profileIsPublished
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }`}
                >
                  {loading
                    ? "Tarkistetaan profiilia"
                    : profileIsPublished
                      ? "Profiili julkaistu"
                      : "Profiili ei ole vielä julkaistu"}
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  {loading
                    ? "Odota hetki..."
                    : profileIsPublished
                      ? "Yrityksesi näkyy asiakkaille"
                      : "Viimeistele profiili ja odota hyväksyntää"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          title="Yhteenveto"
          description="Tärkeimmät tiedot yrityksesi toiminnasta."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              href={stat.href}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Pikatoiminnot"
          description="Siirry nopeasti yleisimpiin toimintoihin."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <QuickAction
              key={action.href}
              title={action.title}
              description={action.description}
              href={action.href}
              icon={action.icon}
            />
          ))}
        </div>
      </section>

      <PartnerCard>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {partner?.profile_completed
                ? "Pidä yritysprofiilisi ajan tasalla"
                : "Viimeistele yritysprofiilisi"}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Laadukas kuvaus, selkeät hinnat ja hyvät kuvat auttavat
              asiakkaita valitsemaan yrityksesi.
            </p>

            {!loading &&
              typeof partner?.profile_completion === "number" && (
                <p className="mt-3 text-sm font-medium text-emerald-400">
                  Profiili valmis {partner.profile_completion} %
                </p>
              )}
          </div>

          <Link
            href="/partner/profile"
            className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            Muokkaa profiilia
          </Link>
        </div>
      </PartnerCard>
    </div>
  );
}