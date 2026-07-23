"use client";

import {
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  DEFAULT_APPLICATION_FORM,
} from "./types";

import type {
  PartnerApplicationForm,
} from "./types";

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidWebsite(
  value: string,
) {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(
      value.trim(),
    );

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

export function usePartnerApplication() {
  const [form, setForm] =
    useState<PartnerApplicationForm>(
      DEFAULT_APPLICATION_FORM,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  function updateField(
    field: keyof PartnerApplicationForm,
    value: string,
  ) {
    setError("");

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm() {
    const companyName =
      form.company_name.trim();

    const contactName =
      form.contact_name.trim();

    const email =
      form.email.trim().toLowerCase();

    const phone =
      form.phone.trim();

    if (
      !companyName ||
      !contactName ||
      !email ||
      !phone ||
      !form.service_category ||
      !form.city
    ) {
      return "Täytä kaikki tähdellä merkityt kentät.";
    }

    if (
      companyName.length < 2
    ) {
      return "Anna yrityksen nimi.";
    }

    if (
      contactName.length < 2
    ) {
      return "Anna yhteyshenkilön nimi.";
    }

    if (
      !EMAIL_PATTERN.test(email)
    ) {
      return "Anna kelvollinen sähköpostiosoite.";
    }

    if (phone.length < 6) {
      return "Anna kelvollinen puhelinnumero.";
    }

    if (
      !isValidWebsite(
        form.website,
      )
    ) {
      return "Verkkosivuston osoitteen tulee alkaa muodossa https:// tai http://.";
    }

    if (
      form.description.length >
      2000
    ) {
      return "Yrityksen kuvaus voi olla enintään 2000 merkkiä.";
    }

    if (
      form.notes.length > 1000
    ) {
      return "Lisätiedot voivat olla enintään 1000 merkkiä.";
    }

    return "";
  }

  async function submit() {
    if (loading) {
      return false;
    }

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return false;
    }

    try {
      setLoading(true);

      const {
        error: insertError,
      } = await supabase
        .from(
          "partner_applications",
        )
        .insert({
          company_name:
            form.company_name.trim(),

          contact_name:
            form.contact_name.trim(),

          email:
            form.email
              .trim()
              .toLowerCase(),

          phone:
            form.phone.trim(),

          description:
            form.description.trim() ||
            null,

          service_category:
            form.service_category,

          city: form.city,

          website:
            form.website.trim() ||
            null,

          notes:
            form.notes.trim() ||
            null,

          status: "pending",
        });

      if (insertError) {
        if (
          insertError.code ===
          "23505"
        ) {
          throw new Error(
            "Tällä sähköpostiosoitteella on jo lähetetty kumppanihakemus.",
          );
        }

        throw insertError;
      }

      setSuccess(true);
      return true;
    } catch (submitError) {
      console.error(
        "PARTNER APPLICATION SUBMIT ERROR:",
        submitError,
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Hakemuksen lähettäminen epäonnistui. Yritä hetken kuluttua uudelleen.",
      );

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    error,
    success,

    updateField,
    submit,
  };
}