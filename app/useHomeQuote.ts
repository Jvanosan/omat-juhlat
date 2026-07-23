"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export type HomeQuoteEvent = {
  date: string;
  eventType: string;
  location: string;
  guests: string;
  budget: string;
  email: string;
  notes: string;
};

const DEFAULT_EVENT: HomeQuoteEvent = {
  date: "",
  eventType: "",
  location: "",
  guests: "",
  budget: "",
  email: "",
  notes: "",
};

type QuoteApiResponse = {
  quoteId?: number | string;
  accessToken?: string;
  matchedPartners?: number;
  error?: string;
};

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useHomeQuote() {
  const router = useRouter();

  const [event, setEvent] =
    useState<HomeQuoteEvent>(
      DEFAULT_EVENT,
    );

  const [
    selectedServices,
    setSelectedServices,
  ] = useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  function toggleService(
    serviceId: string,
  ) {
    setErrorMsg("");

    setSelectedServices(
      (current) =>
        current.includes(serviceId)
          ? current.filter(
              (id) =>
                id !== serviceId,
            )
          : [
              ...current,
              serviceId,
            ],
    );
  }

  function validateForm() {
    const cleanEmail =
      event.email
        .trim()
        .toLowerCase();

    const guests = Number(
      event.guests,
    );

    if (
      !event.date ||
      !event.eventType ||
      !event.location ||
      !event.guests ||
      !cleanEmail ||
      selectedServices.length === 0
    ) {
      return "Täytä päivämäärä, tapahtumatyyppi, paikkakunta, vierasmäärä ja sähköposti sekä valitse vähintään yksi palvelu.";
    }

    if (
      !EMAIL_PATTERN.test(
        cleanEmail,
      )
    ) {
      return "Anna kelvollinen sähköpostiosoite.";
    }

    if (
      !Number.isInteger(guests) ||
      guests < 1
    ) {
      return "Vierasmäärän täytyy olla vähintään 1.";
    }

    if (guests > 10000) {
      return "Vierasmäärä voi olla enintään 10 000.";
    }

    const selectedDate =
  new Date(
    `${event.date}T00:00:00`,
  );

const earliestDate =
  new Date();

earliestDate.setHours(
  0,
  0,
  0,
  0,
);

earliestDate.setDate(
  earliestDate.getDate() + 3,
);

if (
  Number.isNaN(
    selectedDate.getTime(),
  ) ||
  selectedDate <
    earliestDate
) {
  return "Valitse tapahtumapäivä vähintään kolmen päivän päähän.";
}

    if (
      event.notes.length > 2000
    ) {
      return "Lisätiedot voivat olla enintään 2000 merkkiä.";
    }

    if (
      event.budget.trim()
    ) {
      const budget = Number(
        event.budget,
      );

      if (
        !Number.isFinite(
          budget,
        ) ||
        budget < 0
      ) {
        return "Budjetin täytyy olla 0 tai sitä suurempi.";
      }
    }

    return "";
  }

  async function submit() {
    if (loading) {
      return;
    }

    setErrorMsg("");

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMsg(
        validationError,
      );

      document
        .getElementById(
          "quote-submit-status",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      return;
    }

    const guests = Number(
      event.guests,
    );

    const budget =
      event.budget.trim() === ""
        ? null
        : Number(event.budget);

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/request-quotes",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              date: event.date,

              eventType:
                event.eventType,

              location:
                event.location,

              guests,

              email:
                event.email
                  .trim()
                  .toLowerCase(),

              budget,

              services:
                selectedServices,

              notes:
                event.notes.trim(),
            }),
          },
        );

      const responseText =
        await response.text();

      let result:
        QuoteApiResponse = {};

      if (responseText) {
        try {
          result =
            JSON.parse(
              responseText,
            ) as QuoteApiResponse;
        } catch {
          console.error(
            "REQUEST QUOTE INVALID API RESPONSE:",
            responseText,
          );

          setErrorMsg(
            "Palvelin palautti virheellisen vastauksen. Yritä hetken kuluttua uudelleen.",
          );

          return;
        }
      }

      if (!response.ok) {
        console.error(
          "REQUEST QUOTE API ERROR:",
          {
            status:
              response.status,
            result,
          },
        );

        setErrorMsg(
          result.error ||
            "Tarjouspyynnön lähettäminen epäonnistui. Yritä uudelleen.",
        );

        return;
      }

      if (
        !result.quoteId ||
        !result.accessToken
      ) {
        setErrorMsg(
          "Tarjouspyyntö tallennettiin, mutta turvallista asiakaslinkkiä ei saatu.",
        );

        return;
      }

      router.push(
        `/quote/${encodeURIComponent(
          String(
            result.quoteId,
          ),
        )}?token=${encodeURIComponent(
          result.accessToken,
        )}`,
      );
    } catch (error) {
      console.error(
        "REQUEST QUOTE ERROR:",
        error,
      );

      setErrorMsg(
        "Yhteys palvelimeen epäonnistui. Tarkista verkkoyhteys ja yritä uudelleen.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    event,
    setEvent,

    selectedServices,
    loading,
    errorMsg,

    toggleService,
    submit,
  };
}