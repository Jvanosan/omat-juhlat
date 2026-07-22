import { cleanAndNormalizeServices } from "@/components/browse/browseUtils";

import type {
  PublicPartner,
  PublicPartnerReview,
} from "./types";

export function getPublicPartnerServices(
  partner: PublicPartner,
): string[] {
  return Array.from(
    new Set([
      ...cleanAndNormalizeServices(
        partner.category,
      ),
      ...cleanAndNormalizeServices(
        partner.services,
      ),
    ]),
  );
}

export function normalizePartnerImages(
  raw: unknown,
): string[] {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw
      .flatMap((image) =>
        normalizePartnerImages(image),
      )
      .filter(Boolean);
  }

  const value = String(raw).trim();

  if (!value) {
    return [];
  }

  // JSON-muotoisten kuvalistojen tuki.
  if (
    value.startsWith("[") &&
    value.endsWith("]")
  ) {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return normalizePartnerImages(
          parsed,
        );
      }
    } catch {
      // Vanha pilkuilla eroteltu muoto
      // käsitellään seuraavaksi.
    }
  }

  return value
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);
}

export function getPartnerProfileImages(
  partner: PublicPartner,
): {
  galleryImages: string[];
  mainImage: string;
} {
  const galleryImages =
    normalizePartnerImages(
      partner.images,
    );

  const allImages = Array.from(
    new Set(
      [
        partner.cover_image_url,
        ...galleryImages,
      ].filter(
        (image): image is string =>
          Boolean(image),
      ),
    ),
  );

  return {
    galleryImages,
    mainImage: allImages[0] ?? "",
  };
}

export function calculateAverageRating(
  reviews: PublicPartnerReview[],
): string | null {
  if (reviews.length === 0) {
    return null;
  }

  const total = reviews.reduce(
    (sum, review) =>
      sum + Number(review.rating),
    0,
  );

  return (
    total / reviews.length
  ).toFixed(1);
}

export function formatReviewDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(
    "fi-FI",
  );
}