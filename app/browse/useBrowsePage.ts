"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  EVENT_TYPES,
  LOCATIONS,
  TOAST_DURATION_MS,
} from "@/components/browse/constants";

import {
  countVisiblePartners,
  getBrowseAreas,
  getBrowseServices,
  getMinimumEventDate,
  groupPartners,
} from "@/components/browse/browseUtils";

import type {
  AvailabilityState,
  BrowsePartner,
  DirectRequestResult,
  SelectionToast,
} from "@/components/browse/types";

export function useBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [partners, setPartners] = useState<
    BrowsePartner[]
  >([]);

  const [
    selectedPartners,
    setSelectedPartners,
  ] = useState<string[]>([]);

  const [areaFilter, setAreaFilter] =
    useState("Kaikki");

  const [serviceFilter, setServiceFilter] =
    useState("Kaikki");

  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] =
    useState("");
  const [guests, setGuests] = useState("");
  const [location, setLocation] =
    useState("");
  const [eventType, setEventType] =
    useState("");
  const [notes, setNotes] = useState("");

  const [sending, setSending] =
    useState(false);
  const [success, setSuccess] =
    useState(false);

  const [loadingPartners, setLoadingPartners] =
    useState(true);

  const [partnersError, setPartnersError] =
    useState("");

  const [
    unavailablePartnerIds,
    setUnavailablePartnerIds,
  ] = useState<string[]>([]);

  const [
    checkingAvailability,
    setCheckingAvailability,
  ] = useState(false);

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState("");

  const [
    availabilityNotice,
    setAvailabilityNotice,
  ] = useState("");

  const [toast, setToast] =
    useState<SelectionToast | null>(null);

  const minDate = useMemo(
    () => getMinimumEventDate(),
    [],
  );

  const areas = useMemo(
    () => getBrowseAreas(partners),
    [partners],
  );

  const services = useMemo(
    () => getBrowseServices(partners),
    [partners],
  );

  const groupedPartners = useMemo(
    () =>
      groupPartners(
        partners,
        areaFilter,
        serviceFilter,
      ),
    [
      partners,
      areaFilter,
      serviceFilter,
    ],
  );

  const visiblePartnerCount = useMemo(
    () =>
      countVisiblePartners(
        groupedPartners,
      ),
    [groupedPartners],
  );

  useEffect(() => {
    let active = true;

    async function fetchPartners() {
      setLoadingPartners(true);
      setPartnersError("");

      const { data, error } = await supabase
        .from("public_partners")
        .select(`
          id,
          company,
          area,
          category,
          services,
          images,
          logo_url,
          cover_image_url,
          slug
        `);

      if (!active) {
        return;
      }

      if (error) {
        console.error(
          "SUPABASE PARTNERS ERROR:",
          error,
        );

        setPartnersError(
          "Yrityksiä ei voitu ladata.",
        );

        setLoadingPartners(false);
        return;
      }

      setPartners(
        (data ?? []).map((partner) => ({
          ...partner,
          id: String(partner.id),
          company:
            partner.company ||
            "Palveluntarjoaja",
        })),
      );

      setLoadingPartners(false);
    }

    void fetchPartners();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const partnerId =
      searchParams.get("select");

    if (!partnerId) {
      return;
    }

    setSelectedPartners((current) => {
      if (current.includes(partnerId)) {
        return current;
      }

      return [...current, partnerId];
    });

    const url = new URL(
      window.location.href,
    );

    url.searchParams.delete("select");

    window.history.replaceState(
      {},
      "",
      url.toString(),
    );
  }, [searchParams]);

  useEffect(() => {
    if (
      !eventDate ||
      partners.length === 0
    ) {
      setUnavailablePartnerIds([]);
      setAvailabilityError("");
      setAvailabilityNotice("");
      setCheckingAvailability(false);
      return;
    }

    const controller =
      new AbortController();

    async function checkAvailability() {
      try {
        setCheckingAvailability(true);
        setAvailabilityError("");
        setAvailabilityNotice("");

        const partnerIds = partners
          .map((partner) =>
            String(partner.id),
          )
          .join(",");

        const query =
          new URLSearchParams({
            date: eventDate,
            partnerIds,
          });

        const response = await fetch(
          `/api/partner-availability?${query.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const result =
          (await response.json()) as {
            unavailablePartnerIds?: string[];
            error?: string;
          };

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Saatavuuden tarkistaminen epäonnistui.",
          );
        }

        const unavailableIds = (
          result.unavailablePartnerIds ?? []
        ).map(String);

        setUnavailablePartnerIds(
          unavailableIds,
        );

        setSelectedPartners(
          (currentSelection) => {
            const removedIds =
              currentSelection.filter(
                (partnerId) =>
                  unavailableIds.includes(
                    partnerId,
                  ),
              );

            if (removedIds.length === 0) {
              return currentSelection;
            }

            const removedCompanies =
              partners
                .filter((partner) =>
                  removedIds.includes(
                    String(partner.id),
                  ),
                )
                .map(
                  (partner) =>
                    partner.company,
                );

            setAvailabilityNotice(
              removedCompanies.length === 1
                ? `${removedCompanies[0]} poistettiin valinnasta, koska yritys ei ole vapaa valittuna päivänä.`
                : `${removedCompanies.length} yritystä poistettiin valinnasta, koska ne eivät ole vapaita valittuna päivänä.`,
            );

            setToast(null);

            return currentSelection.filter(
              (partnerId) =>
                !unavailableIds.includes(
                  partnerId,
                ),
            );
          },
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "PARTNER AVAILABILITY ERROR:",
          error,
        );

        setUnavailablePartnerIds([]);

        setAvailabilityError(
          error instanceof Error
            ? error.message
            : "Saatavuuden tarkistaminen epäonnistui.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setCheckingAvailability(false);
        }
      }
    }

    void checkAvailability();

    return () => {
      controller.abort();
    };
  }, [eventDate, partners]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setToast(null);
      },
      TOAST_DURATION_MS,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  function handleGuestsChange(
    value: string,
  ) {
    if (value === "") {
      setGuests("");
      return;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return;
    }

    const limitedValue = Math.min(
  10000,
  Math.max(1, numberValue),
);

    setGuests(String(limitedValue));
  }

  function togglePartner(
    partner: BrowsePartner,
    availability: AvailabilityState,
  ) {
    if (
      availability === "unavailable" ||
      availability === "loading"
    ) {
      return;
    }

    const partnerId = String(partner.id);

    if (
      selectedPartners.includes(partnerId)
    ) {
      setSelectedPartners((current) =>
        current.filter(
          (id) => id !== partnerId,
        ),
      );

      setToast(null);
      return;
    }

    setSelectedPartners((current) => [
      ...current,
      partnerId,
    ]);

    setToast({
      partnerId,
      company: partner.company,
    });
  }

  function clearSelectedPartners() {
    setSelectedPartners([]);
    setToast(null);
  }

  function undoLatestSelection() {
    if (!toast) {
      return;
    }

    setSelectedPartners((current) =>
      current.filter(
        (id) => id !== toast.partnerId,
      ),
    );

    setToast(null);
  }

  async function submitRequest() {
    if (sending) {
      return;
    }

    const cleanEmail =
      email.trim();

    const guestCount =
      Number(guests);

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !eventType ||
      !location ||
      !cleanEmail ||
      !eventDate ||
      !guests ||
      selectedPartners.length === 0
    ) {
      alert(
        "Valitse tapahtumatyyppi ja sijainti, täytä sähköposti, päivämäärä ja vierasmäärä sekä valitse vähintään yksi yritys.",
      );

      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      alert(
        "Anna kelvollinen sähköpostiosoite.",
      );

      return;
    }

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > 10000
    ) {
      alert(
        "Vierasmäärän täytyy olla 1–10 000.",
      );
if (notes.trim().length > 2000) {
  alert(
    "Lisätiedot voivat olla enintään 2 000 merkkiä.",
  );

  return;
}
      return;
    }

    if (eventDate < minDate) {
      alert(
        "Valitse päivä vähintään kolmen päivän päähän.",
      );

      return;
    }

    setSending(true);

    try {
      const response = await fetch(
        "/api/send-direct-request",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            event_date: eventDate,
            guests: guestCount,
            location,
            event_type: eventType,
            partner_ids:
              selectedPartners,
            notes: notes.trim(),
          }),
        },
      );

      const responseText =
        await response.text();

      let result: DirectRequestResult = {};

      if (responseText) {
        try {
          result =
            JSON.parse(responseText);
        } catch {
          console.error(
            "DIRECT REQUEST INVALID API RESPONSE:",
            responseText,
          );

          throw new Error(
            `Palvelin palautti virheellisen vastauksen. HTTP ${response.status}`,
          );
        }
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            `Tarjouspyynnön lähettäminen epäonnistui. HTTP ${response.status}`,
        );
      }

      if (
        !result.requestId ||
        !result.accessToken
      ) {
        throw new Error(
          "Tarjouspyyntö tallennettiin, mutta turvallista linkkiä ei saatu.",
        );
      }

      setSuccess(true);
      setSelectedPartners([]);
      setToast(null);

      router.push(
        `/direct-request/${encodeURIComponent(
          result.requestId,
        )}?token=${encodeURIComponent(
          result.accessToken,
        )}`,
      );
    } catch (error) {
      console.error(
        "DIRECT REQUEST ERROR:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Tarjouspyynnön lähettäminen epäonnistui.",
      );
    } finally {
      setSending(false);
    }
  }

  return {
    partners,
    selectedPartners,

    areaFilter,
    serviceFilter,
    email,
    eventDate,
    guests,
    location,
    eventType,
    notes,

    sending,
    success,
    loadingPartners,
    partnersError,

    unavailablePartnerIds,
    checkingAvailability,
    availabilityError,
    availabilityNotice,

    toast,
    minDate,
    areas,
    services,
    groupedPartners,
    visiblePartnerCount,

    eventTypes: [...EVENT_TYPES],
    locations: [...LOCATIONS],

    setAreaFilter,
    setServiceFilter,
    setEmail,
    setEventDate,
    setLocation,
    setEventType,
    setNotes,

    handleGuestsChange,
    togglePartner,
        clearSelectedPartners,
    undoLatestSelection,
    closeToast: () => setToast(null),
    submitRequest,
  };
}