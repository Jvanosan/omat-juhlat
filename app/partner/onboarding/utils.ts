import type {
  OnboardingForm,
  ValidationResult,
} from "./types";

export function normalizeWebsite(
  url: string,
) {
  const cleanUrl = url.trim();

  if (!cleanUrl) {
    return "";
  }

  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://")
  ) {
    return cleanUrl;
  }

  return `https://${cleanUrl}`;
}

export function createSlug(
  text: string,
) {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function hasProfileImage(
  form: OnboardingForm,
) {
  const hasCoverImage =
    Boolean(
      form.coverImageUrl.trim(),
    );

  const hasGalleryImage =
    form.galleryUrls.some(
      (url) => Boolean(url.trim()),
    );

  return (
    hasCoverImage ||
    hasGalleryImage
  );
}

function hasSelectedService(
  form: OnboardingForm,
) {
  return form.selectedCategories.some(
    (categoryId) =>
      (
        form.selectedOptions[
          categoryId
        ] ?? []
      ).length > 0,
  );
}

function isValidEmail(
  email: string,
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim(),
  );
}

function isValidPhone(
  phone: string,
) {
  const normalizedPhone =
    phone.replace(/[\s()-]/g, "");

  return /^\+?[0-9]{7,15}$/.test(
    normalizedPhone,
  );
}

function validateGuestLimits(
  form: OnboardingForm,
): ValidationResult {
  const minimumGuests =
    form.company.minGuests.trim()
      ? Number(
          form.company.minGuests,
        )
      : null;

  const maximumGuests =
    form.company.maxGuests.trim()
      ? Number(
          form.company.maxGuests,
        )
      : null;

  if (
    minimumGuests !== null &&
    (
      !Number.isInteger(
        minimumGuests,
      ) ||
      minimumGuests < 1
    )
  ) {
    return {
      valid: false,
      message:
        "Vähimmäisvierasmäärän täytyy olla vähintään 1.",
    };
  }

  if (
    maximumGuests !== null &&
    (
      !Number.isInteger(
        maximumGuests,
      ) ||
      maximumGuests < 1
    )
  ) {
    return {
      valid: false,
      message:
        "Enimmäisvierasmäärän täytyy olla vähintään 1.",
    };
  }

  if (
    minimumGuests !== null &&
    maximumGuests !== null &&
    minimumGuests >
      maximumGuests
  ) {
    return {
      valid: false,
      message:
        "Vähimmäisvierasmäärä ei voi olla enimmäisvierasmäärää suurempi.",
    };
  }

  return {
    valid: true,
  };
}

function validatePricing(
  form: OnboardingForm,
): ValidationResult {
  for (
    const item of
    form.pricingItems
  ) {
    const price = Number(
      item.price,
    );

    if (!item.label.trim()) {
      return {
        valid: false,
        message:
          "Anna jokaiselle hinnalle nimi.",
      };
    }

    if (
      !item.price.trim() ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return {
        valid: false,
        message:
          "Tarkista lisäämiesi hintojen summat.",
      };
    }
  }

  return {
    valid: true,
  };
}

export function calculateCompletion(
  form: OnboardingForm,
) {
  const requiredItems = [
    Boolean(
      form.company.companyName.trim(),
    ),
    Boolean(
      form.company.email.trim(),
    ),
    Boolean(
      form.company.phone.trim(),
    ),
    Boolean(form.logoUrl.trim()),
    hasProfileImage(form),
    form.selectedCategories.length >
      0,
    hasSelectedService(form),
  ];

  const completedItems =
    requiredItems.filter(
      Boolean,
    ).length;

  return Math.round(
    (
      completedItems /
      requiredItems.length
    ) * 100,
  );
}

export function validateStep(
  step: number,
  form: OnboardingForm,
): ValidationResult {
  switch (step) {
    case 0: {
      if (
        !form.company.companyName.trim()
      ) {
        return {
          valid: false,
          message:
            "Yrityksen nimi puuttuu.",
        };
      }

      if (
        !form.company.email.trim()
      ) {
        return {
          valid: false,
          message:
            "Sähköposti puuttuu.",
        };
      }

      if (
        !isValidEmail(
          form.company.email,
        )
      ) {
        return {
          valid: false,
          message:
            "Anna kelvollinen sähköpostiosoite.",
        };
      }

      if (
        !form.company.phone.trim()
      ) {
        return {
          valid: false,
          message:
            "Puhelinnumero puuttuu.",
        };
      }

      if (
        !isValidPhone(
          form.company.phone,
        )
      ) {
        return {
          valid: false,
          message:
            "Anna kelvollinen puhelinnumero.",
        };
      }

      return validateGuestLimits(
        form,
      );
    }

    case 1:
      if (!form.logoUrl.trim()) {
        return {
          valid: false,
          message:
            "Lisää yrityksen logo.",
        };
      }

      if (!hasProfileImage(form)) {
        return {
          valid: false,
          message:
            "Lisää vähintään yksi yrityksen tai palvelun kuva.",
        };
      }

      return {
        valid: true,
      };

    case 2:
      if (
        form.selectedCategories
          .length === 0
      ) {
        return {
          valid: false,
          message:
            "Valitse vähintään yksi palvelukategoria.",
        };
      }

      if (!hasSelectedService(form)) {
        return {
          valid: false,
          message:
            "Valitse vähintään yksi tarjoamasi palvelu.",
        };
      }

      return {
        valid: true,
      };

    case 3:
      // Hinnoittelu on vapaaehtoinen,
      // mutta lisätyn hinnan pitää olla kelvollinen.
      return validatePricing(form);

    default:
      return {
        valid: true,
      };
  }
}