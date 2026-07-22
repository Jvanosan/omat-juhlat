"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  formatAverageRating,
  hasValidOfferPrice,
  isAcceptedOfferStatus,
  isSubmittedDirectOffer,
} from "@/components/partner/dashboard/dashboardUtils";

import type {
  PartnerDashboardProfile,
  PartnerDashboardStats,
} from "@/components/partner/dashboard/types";

const INITIAL_STATS: PartnerDashboardStats = {
  newRequests: 0,
  sentOffers: 0,
  acceptedOffers: 0,
  averageRating: "–",
  reviewCount: 0,
};

export function usePartnerDashboard() {
  const [partner, setPartner] =
    useState<PartnerDashboardProfile | null>(
      null,
    );

  const [stats, setStats] =
    useState<PartnerDashboardStats>(
      INITIAL_STATS,
    );

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDashboard =
    useCallback(async () => {
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
          setPartner(null);
          setStats(INITIAL_STATS);

          setErrorMessage(
            "Kirjaudu partneritilille nähdäksesi hallintapaneelin tiedot.",
          );

          return;
        }

        const {
          data: partnerData,
          error: partnerError,
        } = await supabase
          .from("partners")
          .select(`
            id,
            company,
            status,
            verified,
            profile_completed,
            profile_completion,
            published_at,
            average_rating,
            review_count,
            slug
          `)
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (partnerError) {
          throw partnerError;
        }

        if (!partnerData) {
          setPartner(null);
          setStats(INITIAL_STATS);

          setErrorMessage(
            "Kirjautuneelle käyttäjälle ei löytynyt partneriprofiilia.",
          );

          return;
        }

        const currentPartner: PartnerDashboardProfile =
          {
            ...partnerData,
            id: String(
              partnerData.id,
            ),
          };

        const [
          categoryResult,
          directOffersResult,
          directRequestsResult,
        ] = await Promise.all([
          supabase
            .from("quote_partners")
            .select(`
              id,
              quote_id,
              status,
              offer_price
            `)
            .eq(
              "partner_id",
              currentPartner.id,
            ),

          supabase
            .from(
              "direct_request_offers",
            )
            .select(`
              id,
              direct_request_id,
              status,
              price
            `)
            .eq(
              "partner_id",
              currentPartner.id,
            ),

          supabase
            .from("direct_requests")
            .select(`
              id,
              status
            `)
            .contains(
              "partner_ids",
              [currentPartner.id],
            ),
        ]);

        if (categoryResult.error) {
          throw categoryResult.error;
        }

        if (
          directOffersResult.error
        ) {
          throw directOffersResult.error;
        }

        if (
          directRequestsResult.error
        ) {
          throw directRequestsResult.error;
        }

        const categoryRows =
          categoryResult.data ?? [];

        const directOfferRows =
          directOffersResult.data ?? [];

        const directRequestRows =
          directRequestsResult.data ?? [];

        const submittedCategoryOffers =
          categoryRows.filter((row) =>
            hasValidOfferPrice(
              row.offer_price,
            ),
          );

        const submittedDirectOffers =
          directOfferRows.filter(
            (row) =>
              isSubmittedDirectOffer(
                row.status,
              ) &&
              hasValidOfferPrice(
                row.price,
              ),
          );

        const categoryRequestsWithoutOffer =
          new Set(
            categoryRows
              .filter(
                (row) =>
                  !hasValidOfferPrice(
                    row.offer_price,
                  ) &&
                  isActionableRequestStatus(
                    row.status,
                  ),
              )
              .map((row) =>
                String(row.quote_id),
              ),
          );

        const directRequestIdsWithOffer =
          new Set(
            submittedDirectOffers.map(
              (offer) =>
                String(
                  offer.direct_request_id,
                ),
            ),
          );

        const directRequestsWithoutOffer =
          directRequestRows.filter(
            (request) =>
              isActionableRequestStatus(
                request.status,
              ) &&
              !directRequestIdsWithOffer.has(
                String(request.id),
              ),
          );

        const acceptedCategoryOffers =
          submittedCategoryOffers.filter(
            (offer) =>
              isAcceptedOfferStatus(
                offer.status,
              ),
          );

        const acceptedDirectOffers =
          submittedDirectOffers.filter(
            (offer) =>
              isAcceptedOfferStatus(
                offer.status,
              ),
          );

        setPartner(currentPartner);

        setStats({
          newRequests:
            categoryRequestsWithoutOffer.size +
            directRequestsWithoutOffer.length,

          sentOffers:
            submittedCategoryOffers.length +
            submittedDirectOffers.length,

          acceptedOffers:
            acceptedCategoryOffers.length +
            acceptedDirectOffers.length,

          averageRating:
            formatAverageRating(
              currentPartner.average_rating,
            ),

          reviewCount:
            Number(
              currentPartner.review_count,
            ) || 0,
        });
      } catch (error) {
        console.error(
          "PARTNER DASHBOARD LOAD ERROR:",
          error,
        );

        setErrorMessage(
          "Dashboardin tietojen lataaminen epäonnistui. Yritä uudelleen.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    partner,
    stats,
    loading,
    errorMessage,
    reload: loadDashboard,
  };
}

function isActionableRequestStatus(
  status: string | null | undefined,
): boolean {
  const normalizedStatus =
    status
      ?.trim()
      .toLowerCase() ?? "";

  return ![
    "accepted",
    "confirmed",
    "selected",
    "valittu",
    "rejected",
    "cancelled",
    "canceled",
    "closed",
    "expired",
    "suljettu",
    "peruttu",
  ].includes(normalizedStatus);
}