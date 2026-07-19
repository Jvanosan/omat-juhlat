import type { OnboardingForm, ValidationResult } from "./types";

export function normalizeWebsite(url: string) {
  if (!url.trim()) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `https://${url}`;
}

export function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function calculateCompletion(
  form: OnboardingForm
) {
  let completed = 0;
  const total = 8;

  if (form.company.companyName) completed++;
  if (form.company.contactName) completed++;
  if (form.company.email) completed++;
  if (form.logoUrl) completed++;
  if (form.coverImageUrl) completed++;
  if (form.selectedCategories.length > 0) completed++;
  if (form.pricingItems.length > 0) completed++;
  if (form.company.description) completed++;

  return Math.round((completed / total) * 100);
}

export function validateStep(
  step: number,
  form: OnboardingForm
): ValidationResult {
  switch (step) {
    case 0:
      if (!form.company.companyName)
        return {
          valid: false,
          message: "Yrityksen nimi puuttuu.",
        };

      if (!form.company.contactName)
        return {
          valid: false,
          message: "Yhteyshenkilö puuttuu.",
        };

      if (!form.company.email)
        return {
          valid: false,
          message: "Sähköposti puuttuu.",
        };

      return {
        valid: true,
      };

    case 1:
      return {
        valid: true,
      };

    case 2:
      if (form.selectedCategories.length === 0)
        return {
          valid: false,
          message:
            "Valitse vähintään yksi palvelukategoria.",
        };

      return {
        valid: true,
      };

    case 3:
      if (form.pricingItems.length === 0)
        return {
          valid: false,
          message: "Lisää vähintään yksi hinta.",
        };

      return {
        valid: true,
      };

    default:
      return {
        valid: true,
      };
  }
}