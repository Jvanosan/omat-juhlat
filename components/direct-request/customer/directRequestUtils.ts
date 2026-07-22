import type {
  CustomerOffer,
} from "@/components/quote/customer/types";

import type {
  DirectOfferApiRow,
} from "./types";

export function normalizeDirectOffer(
  offer: DirectOfferApiRow,
): CustomerOffer {
  return {
    id: offer.id,
    status: offer.status,
    service: null,
    offer_price:
      offer.price === null
        ? null
        : Number(offer.price),
    offer_message:
      offer.message,
    expires_at:
      offer.expires_at,
    created_at:
      offer.created_at,
    partner_id:
      offer.partner_id,
    partner:
      offer.partner,
  };
}

export function normalizeDirectOffers(
  offers: DirectOfferApiRow[],
) {
  return offers.map(
    normalizeDirectOffer,
  );
}

export function isVisibleDirectOffer(
  offer: CustomerOffer,
) {
  const price = Number(
    offer.offer_price,
  );

  return (
    Number.isFinite(price) &&
    price > 0 &&
    [
      "sent",
      "accepted",
      "rejected",
      "expired",
    ].includes(
      offer.status ?? "",
    )
  );
}