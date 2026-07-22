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
  OfferSortOption,
  SelectOfferApiResponse,
} from "@/components/quote/customer/types";

import {
  groupOffersByService,
  isPendingAssignment,
  isReceivedOffer,
  isSelectableOffer,
} from "@/components/quote/customer/quoteUtils";

export function useCustomerQuote() {
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

  const [offers, setOffers] =
    useState<CustomerOffer[]>([]);

  const [
  selectingOfferId,
  setSelectingOfferId,
] = useState<string | null>(null);

  const [sortBy, setSortBy] =
    useState<OfferSortOption>(
      "price",
    );

  const loadData =
    useCallback(async () => {
      if (!accessToken) {
        setAccessDenied(true);
        setErrorMessage("");
        setQuote(null);
        setOffers([]);
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
          setOffers([]);
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Tarjouspyynnön hakeminen epäonnistui.",
          );
        }

        setQuote(
          result.quote ?? null,
        );

        setOffers(
          Array.isArray(
            result.offers,
          )
            ? result.offers
            : [],
        );
      } catch (error) {
        console.error(
          "CUSTOMER QUOTE LOAD ERROR:",
          error,
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Tarjouspyynnön hakeminen epäonnistui.",
        );

        setQuote(null);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    }, [quoteId, accessToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function selectOffer(
    offer: CustomerOffer,
  ) {
    if (
      selectingOfferId !== null
    ) {
      return;
    }

    if (!accessToken) {
      setAccessDenied(true);
      return;
    }

    const confirmed =
      window.confirm(
        `Haluatko valita yrityksen ${
          offer.partner?.company ||
          "palveluntarjoajan"
        } tarjouksen?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setSelectingOfferId(
  String(offer.id),
);

      setErrorMessage("");

      const response = await fetch(
        "/api/quote/select-offer",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            quoteId,
            offerId: offer.id,
            accessToken,
          }),
        },
      );

      const result =
        (await response
          .json()
          .catch(
            () => ({}),
          )) as SelectOfferApiResponse;

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Tarjouksen valitseminen epäonnistui.",
        );
      }

      router.push(
        `/quote/${encodeURIComponent(
          quoteId,
        )}/confirm?token=${encodeURIComponent(
          accessToken,
        )}`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Tarjouksen valitseminen epäonnistui.";

      setErrorMessage(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSelectingOfferId(
        null,
      );
    }
  }

  const receivedOffers =
    useMemo(
      () =>
        offers.filter(
          isReceivedOffer,
        ),
      [offers],
    );

  const pendingRequestCount =
    useMemo(
      () =>
        offers.filter(
          isPendingAssignment,
        ).length,
      [offers],
    );

  const offersByService =
    useMemo(
      () =>
        groupOffersByService(
          receivedOffers,
        ),
      [receivedOffers],
    );

  const serviceCount =
    Object.keys(
      offersByService,
    ).length;

  const selectableOfferCount =
    useMemo(
      () =>
        receivedOffers.filter(
          isSelectableOffer,
        ).length,
      [receivedOffers],
    );

  return {
    loading,
    accessDenied,
    errorMessage,

    quote,
    quoteStatus:
      quote?.status ?? null,

    receivedOffers,
    pendingRequestCount,
    offersByService,
    serviceCount,
    selectableOfferCount,

    sortBy,
    setSortBy,

    selectingOfferId,

    reload: loadData,
    selectOffer,
  };
}