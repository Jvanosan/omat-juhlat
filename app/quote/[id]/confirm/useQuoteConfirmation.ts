"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import type {
  CustomerOffer,
  CustomerQuote,
  CustomerQuoteApiResponse,
} from "@/components/quote/customer/types";

import type {
  ConfirmationApiResponse,
} from "@/components/quote/confirm/types";

import {
  isSelectedOffer,
} from "@/components/quote/customer/quoteUtils";

export function useQuoteConfirmation() {
  const params = useParams<{
    id: string;
  }>();

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const quoteId = params.id;

  const accessToken =
    searchParams.get("token");

  const [loading, setLoading] =
    useState(true);

  const [
    accessDenied,
    setAccessDenied,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [quote, setQuote] =
    useState<CustomerQuote | null>(
      null,
    );

  const [
    selectedOffers,
    setSelectedOffers,
  ] = useState<CustomerOffer[]>([]);

  const [
    confirming,
    setConfirming,
  ] = useState(false);

  const loadSelections =
    useCallback(async () => {
      if (!accessToken) {
        setAccessDenied(true);
        setQuote(null);
        setSelectedOffers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setAccessDenied(false);
        setErrorMessage("");

        const response = await fetch(
          `/api/quote/${encodeURIComponent(
            quoteId,
          )}?token=${encodeURIComponent(
            accessToken,
          )}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result =
          (await response
            .json()
            .catch(
              () => ({}),
            )) as CustomerQuoteApiResponse;

        if (
          response.status === 400 ||
          response.status === 403 ||
          response.status === 404
        ) {
          setAccessDenied(true);
          setQuote(null);
          setSelectedOffers([]);
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Valintojen hakeminen epäonnistui.",
          );
        }

        const offers = Array.isArray(
          result.offers,
        )
          ? result.offers
          : [];

        setQuote(
          result.quote ?? null,
        );

        setSelectedOffers(
          offers.filter(
            isSelectedOffer,
          ),
        );
      } catch (error) {
        console.error(
          "CONFIRMATION LOAD ERROR:",
          error,
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Valintojen hakeminen epäonnistui.",
        );

        setQuote(null);
        setSelectedOffers([]);
      } finally {
        setLoading(false);
      }
    }, [quoteId, accessToken]);

  useEffect(() => {
    void loadSelections();
  }, [loadSelections]);

  const total = useMemo(
    () =>
      selectedOffers.reduce(
        (sum, offer) => {
          const price = Number(
            offer.offer_price,
          );

          return (
            sum +
            (Number.isFinite(price)
              ? price
              : 0)
          );
        },
        0,
      ),
    [selectedOffers],
  );

  const alreadyConfirmed =
    quote?.status === "confirmed" ||
    quote?.status === "suljettu";

  async function confirmSelections() {
    if (confirming) {
      return;
    }

    if (!accessToken) {
      setAccessDenied(true);
      return;
    }

    if (
      selectedOffers.length === 0
    ) {
      setErrorMessage(
        "Valitse vähintään yksi palveluntarjoaja ennen vahvistamista.",
      );

      return;
    }

    if (alreadyConfirmed) {
      router.replace(
        `/quote/${encodeURIComponent(
          quoteId,
        )}?token=${encodeURIComponent(
          accessToken,
        )}`,
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Haluatko vahvistaa valitsemasi palveluntarjoajat? Valintaa ei voi tämän jälkeen vaihtaa.",
      );

    if (!confirmed) {
      return;
    }

    try {
      setConfirming(true);
      setErrorMessage("");

      const response = await fetch(
        "/api/send",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            quoteId,
            accessToken,
          }),
        },
      );

      const result =
        (await response
          .json()
          .catch(
            () => ({}),
          )) as ConfirmationApiResponse;

      if (!response.ok) {
        if (
          result.alreadyConfirmed
        ) {
          router.replace(
            `/quote/${encodeURIComponent(
              quoteId,
            )}?token=${encodeURIComponent(
              accessToken,
            )}`,
          );

          return;
        }

        throw new Error(
          result.error ||
            "Vahvistaminen epäonnistui.",
        );
      }

      router.replace(
        `/quote/${encodeURIComponent(
          quoteId,
        )}?token=${encodeURIComponent(
          accessToken,
        )}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Vahvistaminen epäonnistui.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setConfirming(false);
    }
  }

  return {
    loading,
    accessDenied,
    errorMessage,

    quote,
    selectedOffers,
    total,
    alreadyConfirmed,
    confirming,
    
    quoteHref: accessToken
  ? `/quote/${encodeURIComponent(
      quoteId,
    )}?token=${encodeURIComponent(
      accessToken,
    )}`
  : "/",

    reload: loadSelections,
    confirmSelections,
  };
}