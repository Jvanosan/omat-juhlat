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
function toNullableNumber(value: string) {
  const cleanValue = value.trim();

  if (!cleanValue) {
    return null;
  }

  const numberValue = Number(cleanValue);

  return Number.isFinite(numberValue)
    ? numberValue
    : null;
}
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
  contact_name,
  email,
  phone,
  website,
  area,
  description,

  businessId,
  address,
  postal_code,
  operating_range_km,
  min_guests,
  max_guests,
  avg_price_level,

  parking,
  accessibility,

  instagram_url,
  facebook_url,
  tiktok_url,
  opening_hours,

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
  contactName: partner.contact_name ?? "",
  businessId: partner.businessId ?? "",

  email: partner.email ?? user.email ?? "",
  phone: partner.phone ?? "",
  website: partner.website ?? "",

  city: partner.area ?? "",
  address: partner.address ?? "",
  postalCode: partner.postal_code ?? "",

  operatingRangeKm:
    partner.operating_range_km === null ||
    partner.operating_range_km === undefined
      ? ""
      : String(partner.operating_range_km),

  minGuests:
    partner.min_guests === null ||
    partner.min_guests === undefined
      ? ""
      : String(partner.min_guests),

  maxGuests:
    partner.max_guests === null ||
    partner.max_guests === undefined
      ? ""
      : String(partner.max_guests),

  avgPriceLevel: partner.avg_price_level ?? "",

  parking: Boolean(partner.parking),
  accessibility: Boolean(partner.accessibility),

  instagramUrl: partner.instagram_url ?? "",
  facebookUrl: partner.facebook_url ?? "",
  tiktokUrl: partner.tiktok_url ?? "",
  openingHours: partner.opening_hours ?? "",

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

  function updateCompany<
  Field extends keyof CompanyDetails,
>(
  field: Field,
  value: CompanyDetails[Field],
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

async function submit(
  options: {
    validateAllSteps?: boolean;
    updateOnboardingTimestamp?: boolean;
  } = {},
) {
  setValidationError("");

  const stepsToValidate = options.validateAllSteps
    ? [0, 1, 2, 3]
    : [3];

  for (const stepNumber of stepsToValidate) {
    const validationResult = validateStep(
      stepNumber,
      form,
    );

    if (!validationResult.valid) {
      setValidationError(
        validationResult.message ??
          "Tarkista lomakkeen tiedot.",
      );

      return false;
    }
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

contact_name:
  form.company.contactName.trim() || null,

businessId:
  form.company.businessId.trim() || null,

email: form.company.email.trim(),

phone:
  form.company.phone.trim() || null,

website: form.company.website.trim()
  ? normalizeWebsite(form.company.website)
  : null,

area:
  form.company.city.trim() || null,

address:
  form.company.address.trim() || null,

postal_code:
  form.company.postalCode.trim() || null,

operating_range_km: toNullableNumber(
  form.company.operatingRangeKm,
),

min_guests: toNullableNumber(
  form.company.minGuests,
),

max_guests: toNullableNumber(
  form.company.maxGuests,
),

avg_price_level:
  form.company.avgPriceLevel.trim() || null,

parking: form.company.parking,

accessibility: form.company.accessibility,

instagram_url: form.company.instagramUrl.trim()
  ? normalizeWebsite(form.company.instagramUrl)
  : null,

facebook_url: form.company.facebookUrl.trim()
  ? normalizeWebsite(form.company.facebookUrl)
  : null,

tiktok_url: form.company.tiktokUrl.trim()
  ? normalizeWebsite(form.company.tiktokUrl)
  : null,

opening_hours:
  form.company.openingHours.trim() || null,

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

// Julkisen profiilin näkyvyys päivitetään
// aina myös myöhempien profiilimuutosten yhteydessä.
profile_completed:
  profileCompletion === 100,

...(options.updateOnboardingTimestamp !== false
  ? {
      onboarding_completed_at:
        new Date().toISOString(),

      slug: createSlug(
        form.company.companyName,
      ),
    }
  : {}),
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