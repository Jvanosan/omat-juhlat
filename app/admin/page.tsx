"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSummary from "@/components/admin/AdminSummary";
import ApplicationsSection from "@/components/admin/ApplicationsSection";
import DirectRequestsSection from "@/components/admin/DirectRequestsSection";
import PartnersSection from "@/components/admin/PartnersSection";
import RequestsSection from "@/components/admin/RequestsSection";
import ReviewsSection from "@/components/admin/ReviewsSection";

import { useAdminDashboard } from "./useAdminDashboard";

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
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"
          />

          <p className="font-semibold text-slate-800">
            Ladataan hallintapaneelia...
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Tarkistetaan samalla admin-oikeudet.
          </p>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl">
            🔒
          </div>

          <h1 className="text-2xl font-bold text-slate-950">
            Ei käyttöoikeutta
          </h1>

          <p className="mt-3 leading-6 text-slate-600">
            Sinulla ei ole oikeutta avata
            hallintapaneelia.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          onLogout={() => void logout()}
        />

        {errorMessage && (
          <div
            role="alert"
            className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">
                Tietojen lataaminen epäonnistui
              </p>

              <p className="mt-1 text-sm">
                {errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void reload()}
              className="shrink-0 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Yritä uudelleen
            </button>
          </div>
        )}

        <AdminSummary
          totalPartners={totalPartners}
          openRequests={openRequests}
          pendingApplications={
            pendingApplications
          }
          pendingReviews={
            pendingReviews.length
          }
          onNavigate={scrollToSection}
        />

        <div className="space-y-8">
          <RequestsSection
            requests={requests}
            processingId={
              processingQuoteId
            }
            onUpdateStatus={(
              quoteId,
              status
            ) =>
              void updateQuoteStatus(
                quoteId,
                status
              )
            }
          />

          <DirectRequestsSection
  requests={directRequests}
/>

          <ApplicationsSection
            applications={applications}
            processingId={
              processingApplicationId
            }
            onApprove={(application) =>
              void approveApplication(
                application
              )
            }
            onReject={(applicationId) =>
              void rejectApplication(
                applicationId
              )
            }
          />

          <ReviewsSection
            pendingReviews={pendingReviews}
            approvedReviews={
              approvedReviews
            }
            processingId={
              processingReviewId
            }
            onApprove={(reviewId) =>
              void approveReview(reviewId)
            }
            onReject={(reviewId) =>
              void rejectReview(reviewId)
            }
          />

          <PartnersSection
            partners={partners}
            processingId={
              processingPartnerId
            }
            onUpdateStatus={(
              partnerId,
              status
            ) =>
              void updatePartnerStatus(
                partnerId,
                status
              )
            }
          />
        </div>
      </div>
    </main>
  );
}