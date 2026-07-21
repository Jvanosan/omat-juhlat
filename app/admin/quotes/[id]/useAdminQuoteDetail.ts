"use client";

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import type {
  AdminQuote,
  AdminQuoteOffer,
  AdminQuoteDetailResponse,
} from "@/components/admin/quote-detail/types";

export function useAdminQuoteDetail(quoteId: string) {
  const [quote, setQuote] = useState<AdminQuote | null>(null);
  const [offers, setOffers] = useState<AdminQuoteOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuote = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (!quoteId || !/^\d+$/.test(quoteId)) {
        throw new Error("Tarjouspyynnön tunnus ei ole kelvollinen.");
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
        `/api/admin/quotes/${encodeURIComponent(quoteId)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        },
      );

      const result = (await response.json()) as
        | AdminQuoteDetailResponse
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in result && result.error
            ? result.error
            : "Tarjouspyynnön hakeminen epäonnistui.",
        );
      }

      if (!("quote" in result) || !("offers" in result)) {
        throw new Error("Palvelin palautti virheellisen vastauksen.");
      }

      setQuote(result.quote);
      setOffers(result.offers);
    } catch (error) {
      console.error("ADMIN QUOTE DETAIL ERROR:", error);

      setQuote(null);
      setOffers([]);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Tarjouspyynnön hakeminen epäonnistui.",
      );
    } finally {
      setLoading(false);
    }
  }, [quoteId]);

  useEffect(() => {
    void loadQuote();
  }, [loadQuote]);

  return {
    quote,
    offers,
    loading,
    errorMessage,
    reload: loadQuote,
  };
}