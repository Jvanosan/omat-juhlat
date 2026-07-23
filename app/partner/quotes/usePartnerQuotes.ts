"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  EMPTY_OFFER_DRAFT,
  type CategoryRequest,
  type DirectOffer,
  type DirectRequest,
  type OfferDraft,
  type QuotePartnerRow,
  type RequestQuoteRow,
} from "@/components/partner/quotes/types";

import {
  getTomorrowDate,
  isOfferExpired,
  isOfferLocked,
  toDateInputValue,
  toOfferExpiryTimestamp,
} from "@/components/partner/quotes/quoteUtils";

export function usePartnerQuotes() {
  const minimumOfferExpiry = getTomorrowDate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [currentPartnerId, setCurrentPartnerId] =
    useState<string | null>(null);

  const [directRequests, setDirectRequests] =
    useState<DirectRequest[]>([]);

  const [categoryRequests, setCategoryRequests] =
    useState<CategoryRequest[]>([]);

  const [expandedCard, setExpandedCard] =
    useState<string | null>(null);

  const [draft, setDraft] = useState<OfferDraft>(
    EMPTY_OFFER_DRAFT
  );

  const [savingOffer, setSavingOffer] =
    useState(false);

  const loadQuotes = useCallback(async () => {
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
        setCurrentPartnerId(null);
        setDirectRequests([]);
        setCategoryRequests([]);
        setErrorMessage(
          "Kirjaudu partneritilille nähdäksesi tarjouspyynnöt."
        );
        return;
      }

      const { data: partner, error: partnerError } =
        await supabase
          .from("partners")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

      if (partnerError) {
        throw partnerError;
      }

      if (!partner) {
        setCurrentPartnerId(null);
        setDirectRequests([]);
        setCategoryRequests([]);
        setErrorMessage(
          "Kirjautuneelle käyttäjälle ei löytynyt partneriprofiilia."
        );
        return;
      }

      const partnerId = String(partner.id);

      setCurrentPartnerId(partnerId);

      const [
        directResult,
        directOffersResult,
        quotePartnersResult,
      ] = await Promise.all([
        supabase
          .from("direct_requests")
          .select(`
  id,
  created_at,
  event_date,
  guests,
  partner_ids,
  notes,
  status,
  location,
  budget,
  services,
  event_type,
  viewed
`)
          .contains("partner_ids", [partnerId])
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("direct_request_offers")
          .select(`
            id,
            direct_request_id,
            partner_id,
            price,
            message,
            status,
            expires_at,
            created_at
          `)
          .eq("partner_id", partnerId),

        supabase
          .from("quote_partners")
          .select(`
            id,
            status,
            created_at,
            partner_id,
            service,
            quote_id,
            offer_price,
            offer_message,
            expires_at
          `)
          .eq("partner_id", partnerId)
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (directResult.error) {
        throw directResult.error;
      }

      if (directOffersResult.error) {
        throw directOffersResult.error;
      }

      if (quotePartnersResult.error) {
        throw quotePartnersResult.error;
      }

      const directOffers =
        (directOffersResult.data ?? []) as DirectOffer[];

      const offersByRequestId = new Map(
        directOffers.map((offer) => [
          String(offer.direct_request_id),
          offer,
        ])
      );

      const combinedDirectRequests =
        (directResult.data ?? []).map((request) => ({
          ...request,
          directOffer:
            offersByRequestId.get(
              String(request.id)
            ) ?? null,
        })) as DirectRequest[];

      setDirectRequests(combinedDirectRequests);

      const quotePartnerRows =
        (quotePartnersResult.data ??
          []) as QuotePartnerRow[];

      if (quotePartnerRows.length === 0) {
        setCategoryRequests([]);
        return;
      }

      const quoteIds = Array.from(
        new Set(
          quotePartnerRows.map(
            (row) => row.quote_id
          )
        )
      );

      const {
        data: requestQuoteData,
        error: requestQuoteError,
      } = await supabase
        .from("request_quotes")
        .select(`
  id,
  status,
  created_at,
  location,
  date,
  guests,
  budget,
  services,
  extraInfo,
  event_type,
  notes
`)
        .in("id", quoteIds);

      if (requestQuoteError) {
        throw requestQuoteError;
      }

      const requestQuoteRows =
        (requestQuoteData ?? []) as RequestQuoteRow[];

      const requestsById = new Map(
        requestQuoteRows.map((request) => [
          request.id,
          request,
        ])
      );

      const combinedCategoryRequests =
        quotePartnerRows
          .map((quotePartner) => {
            const request = requestsById.get(
              quotePartner.quote_id
            );

            if (!request) return null;

            return {
              id: request.id,
              quotePartnerId: quotePartner.id,
              quotePartnerStatus:
                quotePartner.status,
              service: quotePartner.service,
              offerPrice:
                quotePartner.offer_price,
              offerMessage:
                quotePartner.offer_message,
              offerExpiresAt:
                quotePartner.expires_at,
              created_at:
                quotePartner.created_at,
              location: request.location,
              date: request.date,
              guests: request.guests,
              budget: request.budget,
              services: request.services,
              extraInfo: request.extraInfo,
              event_type: request.event_type,
              notes: request.notes,
              requestStatus: request.status,
            } satisfies CategoryRequest;
          })
          .filter(
            (
              request
            ): request is CategoryRequest =>
              request !== null
          );

      setCategoryRequests(
        combinedCategoryRequests
      );
    } catch (error) {
      console.error(
        "Tarjouspyyntöjen lataaminen epäonnistui:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Tuntematon virhe tarjouspyyntöjen lataamisessa.";

      setDirectRequests([]);
      setCategoryRequests([]);
      setErrorMessage(
        `Tarjouspyyntöjen lataaminen epäonnistui: ${message}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuotes();
  }, [loadQuotes]);

  function resetEditor() {
    setExpandedCard(null);
    setDraft(EMPTY_OFFER_DRAFT);
  }

  function toggleDirectEditor(
    request: DirectRequest
  ) {
    const cardId = `direct:${request.id}`;

    if (expandedCard === cardId) {
      resetEditor();
      return;
    }

    const offer = request.directOffer;

    setDraft({
      price: offer
        ? String(offer.price)
        : "",
      message: offer?.message ?? "",
      expiresAt: toDateInputValue(
        offer?.expires_at ?? null
      ),
    });

    setExpandedCard(cardId);
  }

  function toggleCategoryEditor(
    request: CategoryRequest
  ) {
    const cardId =
      `category:${request.quotePartnerId}`;

    if (expandedCard === cardId) {
      resetEditor();
      return;
    }

    setDraft({
      price:
        request.offerPrice !== null
          ? String(request.offerPrice)
          : "",
      message: request.offerMessage ?? "",
      expiresAt: toDateInputValue(
        request.offerExpiresAt
      ),
    });

    setExpandedCard(cardId);
  }

  function validateDraft() {
    const numericPrice = Number(draft.price);

    if (
      !draft.price.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      alert(
        "Anna kelvollinen hinta, joka on yli 0 €."
      );
      return null;
    }

    if (!draft.expiresAt) {
      alert(
        "Valitse tarjouksen voimassaoloaika."
      );
      return null;
    }

    if (
      draft.expiresAt <
      minimumOfferExpiry
    ) {
      alert(
        "Tarjouksen voimassaoloajan täytyy olla tulevaisuudessa."
      );
      return null;
    }

    if (draft.message.length > 2000) {
      alert(
        "Viesti voi olla enintään 2000 merkkiä."
      );
      return null;
    }

    return numericPrice;
  }

  async function saveDirectOffer(
    request: DirectRequest
  ) {
    if (!currentPartnerId || savingOffer) {
      return;
    }
        if (
      request.directOffer &&
      (
        isOfferLocked(
          request.directOffer.status,
        ) ||
        isOfferExpired(
          request.directOffer.expires_at,
        )
      )
    ) {
      alert(
        "Tätä tarjousta ei voi enää muokata.",
      );

      await loadQuotes();
      return;
    }

    const numericPrice = validateDraft();

    if (numericPrice === null) return;

    const editing = Boolean(
      request.directOffer
    );

    try {
      setSavingOffer(true);
      if (request.directOffer) {
        const {
          data: updatedOffer,
          error,
        } = await supabase
          .from(
            "direct_request_offers",
          )
          .update({
            price: numericPrice,
            message:
              draft.message.trim() ||
              null,
            expires_at:
              toOfferExpiryTimestamp(
                draft.expiresAt,
              ),
            status: "sent",
          })
          .eq(
            "id",
            request.directOffer.id,
          )
          .eq(
            "partner_id",
            currentPartnerId,
          )
          .in("status", [
            "draft",
            "sent",
          ])
          .select("id")
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!updatedOffer) {
          throw new Error(
            "Tarjous on jo lukittu eikä sitä voi muokata.",
          );
        }
      } else {
        const { error } =
          await supabase
            .from(
              "direct_request_offers",
            )
            .insert({
              direct_request_id:
                request.id,
              partner_id:
                currentPartnerId,
              price: numericPrice,
              message:
                draft.message.trim() ||
                null,
              expires_at:
                toOfferExpiryTimestamp(
                  draft.expiresAt,
                ),
              status: "sent",
            });

        if (error) {
          throw error;
        }
      }
      resetEditor();
      await loadQuotes();

      alert(
        editing
          ? "Tarjouksen muutokset tallennettiin."
          : "Tarjous lähetettiin onnistuneesti."
      );
    } catch (error) {
      console.error(
        "Suoran tarjouksen tallentaminen epäonnistui:",
        error
      );

      alert(
        editing
          ? "Tarjouksen muokkaaminen epäonnistui."
          : "Tarjouksen lähettäminen epäonnistui."
      );
    } finally {
      setSavingOffer(false);
    }
  }

  async function saveCategoryOffer(
    request: CategoryRequest
  ) {
    if (savingOffer) return;
        const existingOffer =
      Number.isFinite(
        Number(request.offerPrice),
      ) &&
      Number(request.offerPrice) > 0;

    if (
      existingOffer &&
      (
        isOfferLocked(
          request.quotePartnerStatus,
        ) ||
        isOfferExpired(
          request.offerExpiresAt,
        )
      )
    ) {
      alert(
        "Tätä tarjousta ei voi enää muokata.",
      );

      await loadQuotes();
      return;
    }

    const numericPrice = validateDraft();

    if (numericPrice === null) return;

        const editing = existingOffer;

    try {
      setSavingOffer(true);

            const {
        data: updatedOffer,
        error,
      } = await supabase
        .from("quote_partners")
        .update({
          offer_price: numericPrice,
          offer_message:
            draft.message.trim() ||
            null,
          expires_at:
            toOfferExpiryTimestamp(
              draft.expiresAt,
            ),
          status: "offered",
        })
        .eq(
          "id",
          request.quotePartnerId,
        )
        .eq(
          "partner_id",
          currentPartnerId,
        )
        .in("status", [
          "sent",
          "offered",
        ])
        .select("id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!updatedOffer) {
        throw new Error(
          "Tarjous on jo lukittu eikä sitä voi muokata.",
        );
      }

      resetEditor();
      await loadQuotes();

      alert(
        editing
          ? "Tarjouksen muutokset tallennettiin."
          : "Tarjous lähetettiin onnistuneesti."
      );
    } catch (error) {
      console.error(
        "Kategoriatarjouksen tallentaminen epäonnistui:",
        error
      );

      alert(
        editing
          ? "Tarjouksen muokkaaminen epäonnistui."
          : "Tarjouksen lähettäminen epäonnistui."
      );
    } finally {
      setSavingOffer(false);
    }
  }

  function setDraftPrice(value: string) {
    setDraft((current) => ({
      ...current,
      price: value,
    }));
  }

  function setDraftMessage(value: string) {
    setDraft((current) => ({
      ...current,
      message: value,
    }));
  }

  function setDraftExpiry(value: string) {
    setDraft((current) => ({
      ...current,
      expiresAt: value,
    }));
  }

  return {
    loading,
    errorMessage,
    directRequests,
    categoryRequests,
    expandedCard,
    draft,
    savingOffer,
    minimumOfferExpiry,
    hasAnyRequests:
      directRequests.length > 0 ||
      categoryRequests.length > 0,
    toggleDirectEditor,
    toggleCategoryEditor,
    closeEditor: resetEditor,
    saveDirectOffer,
    saveCategoryOffer,
    setDraftPrice,
    setDraftMessage,
    setDraftExpiry,
  };
}