"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useSearchParams,
} from "next/navigation";

import type {
  CustomerOffer,
  OfferSortOption,
} from "@/components/quote/customer/types";

import type {
  DirectOfferSelectionResponse,
  DirectRequestApiResponse,
  DirectRequestDetails,
} from "@/components/direct-request/customer/types";

import {
  normalizeDirectOffers,
  isVisibleDirectOffer,
} from "@/components/direct-request/customer/directRequestUtils";

import {
  isSelectableOffer,
  isSelectedOffer,
  sortOffers,
} from "@/components/quote/customer/quoteUtils";

export function useDirectRequest() {
  const params = useParams<{
    id: string;
  }>();

  const searchParams =
    useSearchParams();

  const directRequestId =
    params.id;

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

  const [
    directRequest,
    setDirectRequest,
  ] =
    useState<DirectRequestDetails | null>(
      null,
    );

  const [offers, setOffers] =
    useState<CustomerOffer[]>([]);

  const [
    selectingOfferId,
    setSelectingOfferId,
  ] = useState<string | null>(
    null,
  );

  const [sortBy, setSortBy] =
    useState<OfferSortOption>(
      "price",
    );

  const loadData =
    useCallback(async () => {
      if (!accessToken) {
        setAccessDenied(true);
        setDirectRequest(null);
        setOffers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setAccessDenied(false);
        setErrorMessage("");

        const response = await fetch(
          `/api/direct-request/${encodeURIComponent(
            directRequestId,
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
            )) as DirectRequestApiResponse;

        if (
          response.status === 400 ||
          response.status === 403 ||
          response.status === 404
        ) {
          setAccessDenied(true);
          setDirectRequest(null);
          setOffers([]);
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Tarjouspyynnön hakeminen epäonnistui.",
          );
        }

        const normalizedOffers =
          normalizeDirectOffers(
            Array.isArray(
              result.offers,
            )
              ? result.offers
              : [],
          ).filter(
            isVisibleDirectOffer,
          );

        setDirectRequest(
          result.request ?? null,
        );

        setOffers(
          normalizedOffers,
        );
      } catch (error) {
        console.error(
          "CUSTOMER DIRECT REQUEST LOAD ERROR:",
          error,
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Tarjouspyynnön hakeminen epäonnistui.",
        );

        setDirectRequest(null);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    }, [
      directRequestId,
      accessToken,
    ]);

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
        } tarjouksen? Valintaa ei voi tämän jälkeen vaihtaa.`,
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
        "/api/direct-request/select-offer",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            directRequestId,
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
          )) as DirectOfferSelectionResponse;

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Tarjouksen valitseminen epäonnistui.",
        );
      }

      await loadData();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Tarjouksen valitseminen epäonnistui.",
      );

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

  const sortedOffers = useMemo(
    () =>
      sortOffers(
        offers,
        sortBy,
      ),
    [offers, sortBy],
  );

  const selectableOfferCount =
    useMemo(
      () =>
        offers.filter(
          isSelectableOffer,
        ).length,
      [offers],
    );

  const acceptedOffer =
    useMemo(
      () =>
        offers.find(
          isSelectedOffer,
        ) ?? null,
      [offers],
    );

  return {
    loading,
    accessDenied,
    errorMessage,

    directRequest,
    offers: sortedOffers,
    receivedOfferCount:
      offers.length,
    selectableOfferCount,
    acceptedOffer,

    sortBy,
    setSortBy,

    selectingOfferId,

    reload: loadData,
    selectOffer,
  };
}