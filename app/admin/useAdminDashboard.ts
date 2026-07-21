"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import type {
  AdminDirectRequestSummary,
  AdminPartner,
  AdminQuote,
  AdminReview,
  PartnerApplication,
  PartnerStatus,
  QuoteStatus,
} from "@/components/admin/types";

export function useAdminDashboard() {
  const router = useRouter();

  const [authorized, setAuthorized] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [partners, setPartners] =
    useState<AdminPartner[]>([]);

  const [requests, setRequests] =
    useState<AdminQuote[]>([]);

    const [directRequests, setDirectRequests] =
  useState<AdminDirectRequestSummary[]>([]);

  const [applications, setApplications] =
    useState<PartnerApplication[]>([]);

  const [pendingReviews, setPendingReviews] =
    useState<AdminReview[]>([]);

  const [approvedReviews, setApprovedReviews] =
    useState<AdminReview[]>([]);

  const [
    processingPartnerId,
    setProcessingPartnerId,
  ] = useState<string | null>(null);

  const [
    processingQuoteId,
    setProcessingQuoteId,
  ] = useState<string | null>(null);

  const [
    processingApplicationId,
    setProcessingApplicationId,
  ] = useState<string | null>(null);

  const [
    processingReviewId,
    setProcessingReviewId,
  ] = useState<string | null>(null);

  async function getAccessToken() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      throw new Error(
        "Admin-istunto ei ole voimassa."
      );
    }

    return session.access_token;
  }

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (
        sessionError ||
        !session?.access_token
      ) {
        setAuthorized(false);
        router.replace("/login");
        return;
      }

      // Tämä suojattu API toimii samalla
      // palvelinpuolen admin-tarkistuksena.
      const partnersResponse = await fetch(
        "/api/admin/partners",
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        }
      );

      const partnersResult =
        await partnersResponse
          .json()
          .catch(() => ({}));

      if (partnersResponse.status === 403) {
        setAuthorized(false);
        router.replace("/login");
        return;
      }

      if (!partnersResponse.ok) {
        throw new Error(
          partnersResult.error ||
            "Partnerien hakeminen epäonnistui."
        );
      }

      setAuthorized(true);
const directRequestsResponse = await fetch(
  "/api/admin/direct-requests",
  {
    method: "GET",
    headers: {
      Authorization:
        `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  },
);

const directRequestsResult =
  await directRequestsResponse
    .json()
    .catch(() => ({}));

if (!directRequestsResponse.ok) {
  throw new Error(
    directRequestsResult.error ||
      "Suorien tarjouspyyntöjen hakeminen epäonnistui.",
  );
}
      const [
        quotesResult,
        offersResult,
        applicationsResult,
        pendingReviewsResult,
        approvedReviewsResult,
      ] = await Promise.all([
        supabase
          .from("request_quotes")
          .select(`
            id,
            date,
            location,
            guests,
            status
          `)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("quote_partners")
          .select("quote_id"),

        supabase
          .from("partner_applications")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("partner_reviews")
          .select(`
            *,
            partners (
              company
            )
          `)
          .eq("approved", false)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("partner_reviews")
          .select(`
            *,
            partners (
              company
            )
          `)
          .eq("approved", true)
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (quotesResult.error) {
        throw quotesResult.error;
      }

      if (offersResult.error) {
        throw offersResult.error;
      }

      if (applicationsResult.error) {
        throw applicationsResult.error;
      }

      if (pendingReviewsResult.error) {
        throw pendingReviewsResult.error;
      }

      if (approvedReviewsResult.error) {
        throw approvedReviewsResult.error;
      }

      const offers =
        offersResult.data ?? [];

      const requestsWithCounts =
        (quotesResult.data ?? []).map(
          (quote) => ({
            ...quote,
            offerCount: offers.filter(
              (offer) =>
                String(offer.quote_id) ===
                String(quote.id)
            ).length,
          })
        ) as AdminQuote[];

      setPartners(
        Array.isArray(partnersResult)
          ? partnersResult
          : []
      );

      setRequests(requestsWithCounts);

      setDirectRequests(
  Array.isArray(directRequestsResult)
    ? (directRequestsResult as AdminDirectRequestSummary[])
    : [],
);

      setApplications(
        (applicationsResult.data ??
          []) as PartnerApplication[]
      );

      setPendingReviews(
        (pendingReviewsResult.data ??
          []) as unknown as AdminReview[]
      );

      setApprovedReviews(
        (approvedReviewsResult.data ??
          []) as unknown as AdminReview[]
      );
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD LOAD ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Admin-tietojen hakeminen epäonnistui."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function updatePartnerStatus(
    partnerId: string,
    status: PartnerStatus
  ) {
    if (processingPartnerId) return;

    try {
      setProcessingPartnerId(partnerId);

      const accessToken =
        await getAccessToken();

      const response = await fetch(
        "/api/admin/partners/status",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            partnerId,
            status,
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Partnerin tilan päivittäminen epäonnistui."
        );
      }

      setPartners((current) =>
        current.map((partner) =>
          partner.id === partnerId
            ? { ...partner, status }
            : partner
        )
      );

      alert(
        status === "approved"
          ? "Partneri hyväksyttiin."
          : "Partneri hylättiin."
      );
    } catch (error) {
      console.error(
        "ADMIN PARTNER STATUS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Partnerin tilan päivittäminen epäonnistui."
      );
    } finally {
      setProcessingPartnerId(null);
    }
  }

  async function updateQuoteStatus(
    quoteId: string,
    status: QuoteStatus
  ) {
    if (processingQuoteId) return;

    try {
      setProcessingQuoteId(quoteId);

      const accessToken =
        await getAccessToken();

      const response = await fetch(
        "/api/admin/quotes/status",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            quoteId,
            status,
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Tarjouspyynnön tilan päivittäminen epäonnistui."
        );
      }

      setRequests((current) =>
        current.map((request) =>
          String(request.id) === quoteId
            ? { ...request, status }
            : request
        )
      );
    } catch (error) {
      console.error(
        "ADMIN QUOTE STATUS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Tarjouspyynnön tilan päivittäminen epäonnistui."
      );
    } finally {
      setProcessingQuoteId(null);
    }
  }

  async function approveApplication(
    application: PartnerApplication
  ) {
    if (processingApplicationId) return;

    try {
      setProcessingApplicationId(
        application.id
      );

      const { error: partnerError } =
        await supabase
          .from("partners")
          .insert({
            company:
              application.company_name,
            email: application.email,
            phone: application.phone,
            description:
              application.description,
            category:
              application.service_category,
            area: application.city,
            verified: false,
            status: "pending",
          });

      if (partnerError) {
        throw partnerError;
      }

      const { error: applicationError } =
        await supabase
          .from("partner_applications")
          .update({
            status: "approved",
          })
          .eq("id", application.id);

      if (applicationError) {
        throw applicationError;
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? {
                ...item,
                status: "approved",
              }
            : item
        )
      );

      const accessToken =
        await getAccessToken();

      const emailResponse = await fetch(
        "/api/admin/send-application-approved",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            email: application.email,
            contactName:
              application.contact_name,
            companyName:
              application.company_name,
          }),
        }
      );

      if (!emailResponse.ok) {
        console.warn(
          "Hakemus hyväksyttiin, mutta sähköpostin lähetys epäonnistui."
        );
      }

      alert("Partnerihakemus hyväksyttiin.");
    } catch (error) {
      console.error(
        "ADMIN APPLICATION APPROVAL ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Hakemuksen hyväksyminen epäonnistui."
      );
    } finally {
      setProcessingApplicationId(null);
    }
  }

  async function rejectApplication(
    applicationId: string
  ) {
    if (processingApplicationId) return;

    try {
      setProcessingApplicationId(
        applicationId
      );

      const { error } = await supabase
        .from("partner_applications")
        .update({
          status: "rejected",
        })
        .eq("id", applicationId);

      if (error) throw error;

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: "rejected",
              }
            : application
        )
      );
    } catch (error) {
      console.error(
        "ADMIN APPLICATION REJECTION ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Hakemuksen hylkääminen epäonnistui."
      );
    } finally {
      setProcessingApplicationId(null);
    }
  }

  async function approveReview(
    reviewId: string
  ) {
    if (processingReviewId) return;

    try {
      setProcessingReviewId(reviewId);

      const review = pendingReviews.find(
        (item) => item.id === reviewId
      );

      const { error } = await supabase
        .from("partner_reviews")
        .update({
          approved: true,
        })
        .eq("id", reviewId);

      if (error) throw error;

      setPendingReviews((current) =>
        current.filter(
          (item) => item.id !== reviewId
        )
      );

      if (review) {
        setApprovedReviews((current) => [
          {
            ...review,
            approved: true,
          },
          ...current,
        ]);
      }
    } catch (error) {
      console.error(
        "ADMIN REVIEW APPROVAL ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Arvostelun hyväksyminen epäonnistui."
      );
    } finally {
      setProcessingReviewId(null);
    }
  }

  async function rejectReview(
    reviewId: string
  ) {
    if (processingReviewId) return;

    try {
      setProcessingReviewId(reviewId);

      const { error } = await supabase
        .from("partner_reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      setPendingReviews((current) =>
        current.filter(
          (item) => item.id !== reviewId
        )
      );
    } catch (error) {
      console.error(
        "ADMIN REVIEW REJECTION ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Arvostelun poistaminen epäonnistui."
      );
    } finally {
      setProcessingReviewId(null);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  function scrollToSection(
    sectionId: string
  ) {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  const totalPartners = partners.length;

 const openCategoryRequests = requests.filter(
  (request) =>
    request.status !== "suljettu" &&
    request.status !== "confirmed",
).length;

const openDirectRequests = directRequests.filter(
  (request) =>
    request.status !== "closed" &&
    request.status !== "accepted" &&
    request.status !== "cancelled",
).length;

const openRequests =
  openCategoryRequests + openDirectRequests;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "pending"
    ).length;

  return {
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
    reload: loadDashboard,
  };
}