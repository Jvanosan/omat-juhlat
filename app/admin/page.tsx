"use client";

import Link from "next/link";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSummary from "@/components/admin/AdminSummary";
import ApplicationsSection from "@/components/admin/ApplicationsSection";
import DirectRequestsSection from "@/components/admin/DirectRequestsSection";
import PartnersSection from "@/components/admin/PartnersSection";
import RequestsSection from "@/components/admin/RequestsSection";
import ReviewsSection from "@/components/admin/ReviewsSection";

import {
  useAdminDashboard,
} from "./useAdminDashboard";

const ADMIN_SECTIONS = [
  {
    id: "requests-section",
    label: "Tarjouspyynnöt",
    icon: "📨",
  },
  {
    id: "direct-requests-section",
    label: "Suorat pyynnöt",
    icon: "🔎",
  },
  {
    id: "applications-section",
    label: "Hakemukset",
    icon: "📋",
  },
  {
    id: "reviews-section",
    label: "Arvostelut",
    icon: "⭐",
  },
  {
    id: "partners-section",
    label: "Kumppanit",
    icon: "🤝",
  },
] as const;

export default function AdminPage() {
  const {
    authorized,
    loading,
    errorMessage,

    partners,
    requests,
    directRequests,
    applications,
    pendingReviews,
    approvedReviews,

    processingPartnerId,
    processingQuoteId,
    processingApplicationId,
    processingReviewId,

    totalPartners,
    openRequests,
    pendingApplications,

    updatePartnerStatus,
    updateQuoteStatus,
    approveApplication,
    rejectApplication,
    approveReview,
    rejectReview,
    logout,
    scrollToSection,
    reload,
  } = useAdminDashboard();

  if (loading) {
    return <AdminLoadingState />;
  }

  if (!authorized) {
    return <AdminAccessDenied />;
  }

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-4 py-6 text-[#211b16] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          onLogout={() =>
            void logout()
          }
        />

        {errorMessage && (
          <div
            role="alert"
            className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-5 text-[#a33d3d] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="text-xl"
              >
                ⚠️
              </span>

              <div>
                <p className="font-bold">
                  Tietojen lataaminen
                  epäonnistui
                </p>

                <p className="mt-1 text-sm leading-6">
                  {errorMessage}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void reload()
              }
              className="shrink-0 rounded-xl bg-[#a33d3d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#8d3030]"
            >
              Yritä uudelleen
            </button>
          </div>
        )}

        <AdminSummary
          totalPartners={
            totalPartners
          }
          openRequests={
            openRequests
          }
          pendingApplications={
            pendingApplications
          }
          pendingReviews={
            pendingReviews.length
          }
          onNavigate={
            scrollToSection
          }
        />

        <AdminSectionNavigation
          onNavigate={
            scrollToSection
          }
        />

        <div className="space-y-8">
          <RequestsSection
            requests={requests}
            processingId={
              processingQuoteId
            }
            onUpdateStatus={(
              quoteId,
              status,
            ) =>
              void updateQuoteStatus(
                quoteId,
                status,
              )
            }
          />

          <DirectRequestsSection
            requests={
              directRequests
            }
          />

          <ApplicationsSection
            applications={
              applications
            }
            processingId={
              processingApplicationId
            }
            onApprove={(
              application,
            ) =>
              void approveApplication(
                application,
              )
            }
            onReject={(
              applicationId,
            ) =>
              void rejectApplication(
                applicationId,
              )
            }
          />

          <ReviewsSection
            pendingReviews={
              pendingReviews
            }
            approvedReviews={
              approvedReviews
            }
            processingId={
              processingReviewId
            }
            onApprove={(reviewId) =>
              void approveReview(
                reviewId,
              )
            }
            onReject={(reviewId) =>
              void rejectReview(
                reviewId,
              )
            }
          />

          <PartnersSection
            partners={partners}
            processingId={
              processingPartnerId
            }
            onUpdateStatus={(
              partnerId,
              status,
            ) =>
              void updatePartnerStatus(
                partnerId,
                status,
              )
            }
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-5 py-3 text-sm font-bold text-[#62584f] shadow-sm transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
          >
            ↑ Takaisin ylös
          </button>
        </div>
      </div>
    </main>
  );
}

function AdminSectionNavigation({
  onNavigate,
}: {
  onNavigate: (
    sectionId: string,
  ) => void;
}) {
  return (
    <nav
      aria-label="Admin-osioiden navigaatio"
      className="sticky top-3 z-30 mb-8 overflow-x-auto rounded-2xl border border-[#e2d5c4] bg-white/95 p-2 shadow-[0_8px_24px_rgba(73,53,31,0.1)] backdrop-blur"
    >
      <div className="flex min-w-max gap-2">
        {ADMIN_SECTIONS.map(
          (section) => (
            <button
              key={section.id}
              type="button"
              onClick={() =>
                onNavigate(
                  section.id,
                )
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold text-[#62584f] transition hover:bg-[#fbf5e9] hover:text-[#87652f]"
            >
              <span aria-hidden="true">
                {section.icon}
              </span>

              {section.label}
            </button>
          ),
        )}
      </div>
    </nav>
  );
}

function AdminLoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf8f2] px-5 text-[#211b16]">
      <div
        role="status"
        className="rounded-3xl border border-[#e2d5c4] bg-white px-9 py-8 text-center shadow-[0_20px_60px_rgba(73,53,31,0.12)]"
      >
        <div
          aria-hidden="true"
          className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
        />

        <p className="mt-4 font-bold text-[#3f362f]">
          Ladataan hallintapaneelia...
        </p>

        <p className="mt-1 text-sm text-[#91877d]">
          Tarkistetaan samalla
          admin-oikeudet.
        </p>
      </div>
    </main>
  );
}

function AdminAccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf8f2] px-5 text-[#211b16]">
      <section className="w-full max-w-md rounded-3xl border border-[#edcaca] bg-white p-8 text-center shadow-[0_20px_60px_rgba(73,53,31,0.12)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f0] text-3xl">
          🔒
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[#211b16]">
          Ei käyttöoikeutta
        </h1>

        <p className="mt-3 leading-7 text-[#70675e]">
          Sinulla ei ole oikeutta avata
          OmatJuhlat-hallintapaneelia.
        </p>

        <div className="mt-6 grid gap-3">
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#b48a45] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9f783a]"
          >
            Siirry admin-kirjautumiseen
          </Link>

          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-5 py-3 text-sm font-bold text-[#62584f] transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
          >
            Palaa etusivulle
          </Link>
        </div>
      </section>
    </main>
  );
}