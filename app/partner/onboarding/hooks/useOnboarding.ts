"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_FORM, TOTAL_STEPS } from "../constants";
import {
  calculateCompletion,
  createSlug,
  normalizeWebsite,
  validateStep,
} from "../utils";

import { supabase } from "@/lib/supabase";

import type {
  CompanyDetails,
  OnboardingForm,
  PricingItem,
  SubmitState,
} from "../types";
import type { ServiceCategoryId } from "../serviceOptions";

export function useOnboarding() {
  const [step, setStep] = useState(0);

  const [form, setForm] =
    useState<OnboardingForm>(DEFAULT_FORM);

  const [submitState, setSubmitState] =
    useState<SubmitState>({
      loading: false,
      error: "",
    });

  const [validationError, setValidationError] =
    useState("");

    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
  let cancelled = false;

  async function loadPartnerProfile() {
    setLoadingProfile(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("Kirjautunutta käyttäjää ei löytynyt.");
      }

      const { data: partner, error: partnerError } =
        await supabase
          .from("partners")
          .select(`
            company,
            email,
            phone,
            website,
            area,
            description,
            logo_url,
            cover_image_url,
            gallery,
            category,
            service_options,
            pricing
          `)
          .eq("auth_user_id", user.id)
          .single();

      if (partnerError) {
        throw partnerError;
      }

      if (!partner || cancelled) {
        return;
      }

      const serviceOptions =
        partner.service_options &&
        typeof partner.service_options === "object"
          ? partner.service_options
          : {};

      const categories = Array.isArray(
        serviceOptions.categories
      )
        ? serviceOptions.categories
        : partner.category
          ? [partner.category]
          : [];

      const options =
        serviceOptions.options &&
        typeof serviceOptions.options === "object"
          ? serviceOptions.options
          : {};

      const pricingItems = Array.isArray(partner.pricing)
        ? partner.pricing.map((item) => ({
            id:
              typeof item.id === "string"
                ? item.id
                : crypto.randomUUID(),
            categoryId: item.categoryId,
            templateId:
              typeof item.templateId === "string"
                ? item.templateId
                : "",
            label:
              typeof item.label === "string"
                ? item.label
                : "",
            description:
              typeof item.description === "string"
                ? item.description
                : "",
            price:
              item.price === null ||
              item.price === undefined
                ? ""
                : String(item.price),
            unit: item.unit,
          }))
        : [];

      setForm({
        company: {
          companyName: partner.company ?? "",
          contactName: "",
          email: partner.email ?? user.email ?? "",
          phone: partner.phone ?? "",
          website: partner.website ?? "",
          city: partner.area ?? "",
          description: partner.description ?? "",
        },

        logoUrl: partner.logo_url ?? "",
        coverImageUrl: partner.cover_image_url ?? "",

        galleryUrls: Array.isArray(partner.gallery)
          ? partner.gallery.filter(
              (url): url is string =>
                typeof url === "string"
            )
          : [],

        selectedCategories: categories,
        selectedOptions: options,
        pricingItems,
      });
    } catch (error) {
      console.error(
        "Partner profile load error:",
        error
      );

      if (!cancelled) {
        setSubmitState({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Partneriprofiilin lataaminen epäonnistui.",
        });
      }
    } finally {
      if (!cancelled) {
        setLoadingProfile(false);
      }
    }
  }

  loadPartnerProfile();

  return () => {
    cancelled = true;
  };
}, []);
  const completion = useMemo(
    () => calculateCompletion(form),
    [form]
  );

  function updateCompany(
    field: keyof CompanyDetails,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value,
      },
    }));
  }

  function setLogoUrl(url: string) {
    setForm((prev) => ({
      ...prev,
      logoUrl: url,
    }));
  }

  function setCoverImageUrl(url: string) {
    setForm((prev) => ({
      ...prev,
      coverImageUrl: url,
    }));
  }

  function setGalleryUrls(urls: string[]) {
    setForm((prev) => ({
      ...prev,
      galleryUrls: urls,
    }));
  }

  function toggleCategory(category: ServiceCategoryId) {
    setForm((prev) => {
      const exists =
        prev.selectedCategories.includes(category);

      if (exists) {
        const updatedCategories =
          prev.selectedCategories.filter(
            (c) => c !== category
          );

        const updatedOptions = {
          ...prev.selectedOptions,
        };

        delete updatedOptions[category];

        const updatedPricing =
          prev.pricingItems.filter(
            (item) =>
              item.categoryId !== category
          );

        return {
          ...prev,
          selectedCategories: updatedCategories,
          selectedOptions: updatedOptions,
          pricingItems: updatedPricing,
        };
      }

      return {
        ...prev,
        selectedCategories: [
          ...prev.selectedCategories,
          category,
        ],
      };
    });
  }

  function toggleOption(
    category: ServiceCategoryId,
    option: string
  ) {
    setForm((prev) => {
      const current =
        prev.selectedOptions[category] ?? [];

      const exists = current.includes(option);

      return {
        ...prev,
        selectedOptions: {
          ...prev.selectedOptions,
          [category]: exists
            ? current.filter((o) => o !== option)
            : [...current, option],
        },
      };
    });
  }

  function setPricingItems(
    items: PricingItem[]
  ) {
    setForm((prev) => ({
      ...prev,
      pricingItems: items,
    }));
  }

  function nextStep() {
    const result = validateStep(step, form);

    if (!result.valid) {
      setValidationError(result.message ?? "");
      return;
    }

    setValidationError("");

    setStep((prev) =>
      Math.min(prev + 1, TOTAL_STEPS - 1)
    );
  }

  function previousStep() {
    setValidationError("");

    setStep((prev) => Math.max(prev - 1, 0));
  }

async function submit() {
  setValidationError("");

  const validationResult = validateStep(3, form);

  if (!validationResult.valid) {
    setValidationError(
      validationResult.message ??
        "Tarkista lomakkeen tiedot."
    );

    return false;
  }

  setSubmitState({
    loading: true,
    error: "",
  });

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error(
        "Kirjautunutta käyttäjää ei löytynyt."
      );
    }

    const profileCompletion =
      calculateCompletion(form);

    const cleanGallery = form.galleryUrls
      .map((url) => url.trim())
      .filter(Boolean);

    const serviceOptions = {
      categories: form.selectedCategories,
      options: form.selectedOptions,
    };

    const { data: updatedPartner, error: updateError } =
      await supabase
        .from("partners")
        .update({
          company: form.company.companyName.trim(),
          email: form.company.email.trim(),
          phone: form.company.phone.trim(),
          website: normalizeWebsite(
            form.company.website
          ),
          area: form.company.city.trim(),
          description:
            form.company.description.trim(),

          logo_url: form.logoUrl.trim() || null,
          cover_image_url:
            form.coverImageUrl.trim() || null,
          gallery: cleanGallery,

          category:
            form.selectedCategories[0] ?? null,

          service_options: serviceOptions,
          pricing: form.pricingItems.map((item) => ({
            id: item.id,
            categoryId: item.categoryId,
            templateId: item.templateId,
            label: item.label.trim(),
            description: item.description.trim(),
            price: Number(item.price),
            unit: item.unit,
          })),

          profile_completion: profileCompletion,
          profile_completed:
            profileCompletion === 100,

          onboarding_completed_at:
            new Date().toISOString(),

          slug: createSlug(
            form.company.companyName
          ),
        })
        .eq("auth_user_id", user.id)
        .select("id, company, profile_completion")
        .single();

    if (updateError) {
      throw updateError;
    }

    if (!updatedPartner) {
      throw new Error(
        "Partneriprofiilia ei löytynyt."
      );
    }

    setSubmitState({
      loading: false,
      error: "",
    });

    return true;
  } catch (error) {
    console.error(
      "Onboarding submit error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Profiilin lähetys epäonnistui.";

    setSubmitState({
      loading: false,
      error: message,
    });

    return false;
  }
}

  return {
    loadingProfile,
    
    step,

    form,

    completion,

    validationError,

    submitState,

    updateCompany,

    setLogoUrl,

    setCoverImageUrl,

    setGalleryUrls,

    toggleCategory,

    toggleOption,

    setPricingItems,

    nextStep,

    previousStep,

    submit,
  };
}