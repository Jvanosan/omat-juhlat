export type DirectOffer = {
  id: string;
  direct_request_id: string;
  partner_id: string;
  price: number;
  message: string | null;
  status: string;
  expires_at: string;
  created_at: string;
};

export type DirectRequest = {
  id: string;
  created_at: string;
  event_date: string | null;
  guests: number | null;
  partner_ids: string[] | null;
  notes: string | null;
  status: string | null;
  location: string | null;
  budget: number | string | null;
  services:
    | string[]
    | string
    | null;
  event_type: string | null;
  viewed: boolean | null;

  // Kirjautuneen partnerin oma tarjous.
  directOffer: DirectOffer | null;
};

export type CategoryRequest = {
  id: number;
  quotePartnerId: number;
  quotePartnerStatus:
    | string
    | null;
  service: string | null;
  offerPrice: number | null;
  offerMessage: string | null;
  offerExpiresAt: string | null;
  created_at: string;
  location: string | null;
  date: string | null;
  guests: number | null;
  budget: number | string | null;
  services:
    | string[]
    | string
    | null;
  extraInfo: string | null;
  event_type: string | null;
  notes: string | null;
  requestStatus: string | null;
};

export type QuotePartnerRow = {
  id: number;
  status: string | null;
  created_at: string;
  partner_id: string;
  service: string | null;
  quote_id: number;
  offer_price: number | null;
  offer_message: string | null;
  expires_at: string | null;
};

export type RequestQuoteRow = {
  id: number;
  status: string | null;
  created_at: string;
  location: string | null;
  date: string | null;
  guests: number | null;
  budget: number | string | null;
  services:
    | string[]
    | string
    | null;
  extraInfo: string | null;
  event_type: string | null;
  notes: string | null;
};

export type CustomerContact = {
  name: string | null;
  email: string;
  phone: string | null;
};

export type OfferDraft = {
  price: string;
  message: string;
  expiresAt: string;
};

export const EMPTY_OFFER_DRAFT:
  OfferDraft = {
    price: "",
    message: "",
    expiresAt: "",
  };