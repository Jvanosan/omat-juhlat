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
  isSelectedOffer,
} from "@/components/quote/customer/quoteUtils";

type RemoveSelectionApiResponse = {
  success?: boolean;
  removedOfferId?: number | string;
  error?: string;
};

export function useCustomerQuote() {
  const params = useParams<{
    id: string;
  }>();

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

  const [
    selectionMessage,
    setSelectionMessage,
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
  ] = useState<string | null>(
    null,
  );

  const [
    removingOfferId,
    setRemovingOfferId,
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

  function selectionsAreLocked() {
    return (
      quote?.status === "confirmed" ||
      quote?.status === "suljettu"
    );
  }

  async function selectOffer(
    offer: CustomerOffer,
  ) {
    if (
      selectingOfferId !== null ||
      removingOfferId !== null
    ) {
      return;
    }

    if (!accessToken) {
      setAccessDenied(true);
      return;
    }

    if (selectionsAreLocked()) {
      setErrorMessage(
        "Tarjouspyyntö on jo vahvistettu, eikä valintoja voi enää muuttaa.",
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Haluatko valita yrityksen ${
          offer.partner?.company ||
          "palveluntarjoajan"
        } tarjouksen? Voit vielä muuttaa valintaasi ennen lopullista vahvistamista.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setSelectingOfferId(
        String(offer.id),
      );

      setErrorMessage("");
      setSelectionMessage("");

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

      await loadData();

      setSelectionMessage(
        "Valinta tallennettiin. Voit valita lisää palveluita, vaihtaa valintaa tai siirtyä tarkistamaan valintasi.",
      );

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

  async function removeSelectedOffer(
    offer: CustomerOffer,
  ) {
    if (
      selectingOfferId !== null ||
      removingOfferId !== null
    ) {
      return;
    }

    if (!accessToken) {
      setAccessDenied(true);
      return;
    }

    if (selectionsAreLocked()) {
      setErrorMessage(
        "Tarjouspyyntö on jo vahvistettu, eikä valintoja voi enää muuttaa.",
      );

      return;
    }

    if (!isSelectedOffer(offer)) {
      return;
    }

    const confirmed =
      window.confirm(
        `Haluatko poistaa yrityksen ${
          offer.partner?.company ||
          "palveluntarjoajan"
        } alustavan valinnan? Voit valita tarjouksen myöhemmin uudelleen, jos se on vielä voimassa.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingOfferId(
        String(offer.id),
      );

      setErrorMessage("");
      setSelectionMessage("");

      const response = await fetch(
        "/api/quote/remove-selection",
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
          )) as RemoveSelectionApiResponse;

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Valinnan poistaminen epäonnistui.",
        );
      }

      await loadData();

      setSelectionMessage(
        "Valinta poistettiin. Voit valita saman tai toisen tarjouksen uudelleen.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Valinnan poistaminen epäonnistui.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setRemovingOfferId(
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

  const selectedOffers =
    useMemo(
      () =>
        receivedOffers.filter(
          isSelectedOffer,
        ),
      [receivedOffers],
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

  const confirmationHref =
    accessToken
      ? `/quote/${encodeURIComponent(
          quoteId,
        )}/confirm?token=${encodeURIComponent(
          accessToken,
        )}`
      : null;

  return {
    loading,
    accessDenied,
    errorMessage,
    selectionMessage,

    quote,
    quoteStatus:
      quote?.status ?? null,

    receivedOffers,
    selectedOffers,
    selectedOfferCount:
      selectedOffers.length,

    pendingRequestCount,
    offersByService,
    serviceCount,
    selectableOfferCount,

    confirmationHref,

    sortBy,
    setSortBy,

    selectingOfferId,
    removingOfferId,

    reload: loadData,
    selectOffer,
    removeSelectedOffer,

    closeSelectionMessage: () =>
      setSelectionMessage(""),
  };
}