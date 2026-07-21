"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  AdminDirectOffer,
  AdminDirectPartner,
  AdminDirectRequest,
  AdminDirectRequestDetailResponse,
} from "@/components/admin/direct-request-detail/types";
import { supabase } from "@/lib/supabase";

export function useAdminDirectRequestDetail(
  requestId: string,
) {
  const [request, setRequest] =
    useState<AdminDirectRequest | null>(null);

  const [offers, setOffers] = useState<AdminDirectOffer[]>([]);

  const [assignedPartners, setAssignedPartners] = useState<
    AdminDirectPartner[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRequest = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (!requestId) {
        throw new Error(
          "Suoran tarjouspyynnön tunnus puuttuu.",
        );
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error(
          "Kirjaudu admin-tilille nähdäksesi tarjouspyynnön.",
        );
      }

      const response = await fetch(
        `/api/admin/direct-requests/${encodeURIComponent(
          requestId,
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        },
      );

      const result = (await response.json()) as
        | AdminDirectRequestDetailResponse
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in result && result.error
            ? result.error
            : "Suoran tarjouspyynnön hakeminen epäonnistui.",
        );
      }

      if (
        !("request" in result) ||
        !("offers" in result) ||
        !("assignedPartners" in result)
      ) {
        throw new Error(
          "Palvelin palautti virheellisen vastauksen.",
        );
      }

      setRequest(result.request);
      setOffers(result.offers);
      setAssignedPartners(result.assignedPartners);
    } catch (error) {
      console.error(
        "ADMIN DIRECT REQUEST DETAIL ERROR:",
        error,
      );

      setRequest(null);
      setOffers([]);
      setAssignedPartners([]);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Suoran tarjouspyynnön hakeminen epäonnistui.",
      );
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  return {
    request,
    offers,
    assignedPartners,
    loading,
    errorMessage,
    reload: loadRequest,
  };
}