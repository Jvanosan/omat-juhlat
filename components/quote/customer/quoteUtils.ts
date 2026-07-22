import type {
  CustomerOffer,
  OfferSortOption,
  OffersByService,
} from "./types";

export function formatEventDate(
  value: string | null,
) {
  if (!value) {
    return "Päivämäärää ei ilmoitettu";
  }

  const date = new Date(
    value.includes("T")
      ? value
      : `${value}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "fi-FI",
  ).format(date);
}

export function formatOfferExpiry(
  value: string | null,
) {
  if (!value) {
    return null;
  }

  const date = new Date(
    value.includes("T")
      ? value
      : `${value}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "fi-FI",
  ).format(date);
}

export function formatOfferPrice(
  value: number | null,
) {
  const price = Number(value);

  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return "Hintaa ei ilmoitettu";
  }

  return new Intl.NumberFormat(
    "fi-FI",
    {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits:
        Number.isInteger(price) ? 0 : 2,
      maximumFractionDigits: 2,
    },
  ).format(price);
}

export function isOfferExpired(
  value: string | null,
) {
  if (!value) {
    return false;
  }

  const expirationDate = new Date(
    value.includes("T")
      ? value
      : `${value}T23:59:59`,
  );

  if (
    Number.isNaN(
      expirationDate.getTime(),
    )
  ) {
    return false;
  }

  return (
    expirationDate.getTime() <
    Date.now()
  );
}

export function hasValidOfferPrice(
  offer: CustomerOffer,
) {
  const price = Number(
    offer.offer_price,
  );

  return (
    Number.isFinite(price) &&
    price > 0
  );
}

export function isReceivedOffer(
  offer: CustomerOffer,
) {
  return (
    hasValidOfferPrice(offer) &&
    [
      "sent",
      "offered",
      "selected",
      "valittu",
    ].includes(offer.status ?? "")
  );
}

export function isPendingAssignment(
  offer: CustomerOffer,
) {
  return (
    offer.status === "sent" &&
    !hasValidOfferPrice(offer)
  );
}

export function isSelectedOffer(
  offer: CustomerOffer,
) {
  return (
    offer.status === "selected" ||
    offer.status === "valittu" ||
    offer.status === "accepted"
  );
}

export function isSelectableOffer(
  offer: CustomerOffer,
) {
  return (
    hasValidOfferPrice(offer) &&
    !isOfferExpired(
      offer.expires_at,
    ) &&
    (offer.status === "sent" ||
      offer.status === "offered")
  );
}

export function groupOffersByService(
  offers: CustomerOffer[],
): OffersByService {
  return offers.reduce<OffersByService>(
    (groups, offer) => {
      const service =
        offer.service?.trim() ||
        "Muu palvelu";

      if (!groups[service]) {
        groups[service] = [];
      }

      groups[service].push(offer);

      return groups;
    },
    {},
  );
}

export function sortOffers(
  offers: CustomerOffer[],
  sortBy: OfferSortOption,
) {
  return [...offers].sort(
    (first, second) => {
      if (sortBy === "price") {
        return (
          Number(
            first.offer_price ??
              Number.MAX_SAFE_INTEGER,
          ) -
          Number(
            second.offer_price ??
              Number.MAX_SAFE_INTEGER,
          )
        );
      }

      if (sortBy === "rating") {
        return (
          Number(
            second.partner
              ?.averageRating ?? 0,
          ) -
          Number(
            first.partner
              ?.averageRating ?? 0,
          )
        );
      }

      const firstDate = new Date(
        first.created_at,
      ).getTime();

      const secondDate = new Date(
        second.created_at,
      ).getTime();

      return (
        (Number.isNaN(secondDate)
          ? 0
          : secondDate) -
        (Number.isNaN(firstDate)
          ? 0
          : firstDate)
      );
    },
  );
}

export function getPartnerImages(
  value: string | null | undefined,
) {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((image) => image.trim())
        .filter(Boolean),
    ),
  );
}