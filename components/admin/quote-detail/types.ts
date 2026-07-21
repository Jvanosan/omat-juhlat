export type AdminQuote = {
  id: number;
  status: string | null;
  created_at: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  date: string | null;
  guests: number | null;
  budget: string | number | null;
  services: string[] | string | null;
  extraInfo: string | null;
  event_type: string | null;
  notes: string | null;
};

export type AdminOfferPartner = {
  id: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  area: string | null;
  category: string | null;
  services: string[] | string | null;
  logo_url: string | null;
  images: string[] | string | null;
  status: string | null;
};

export type AdminQuoteOffer = {
  id: number;
  status: string | null;
  created_at: string;
  partner_id: string;
  service: string | null;
  offer_price: number | null;
  offer_message: string | null;
  expires_at: string | null;
  partner: AdminOfferPartner | null;
};

export type AdminQuoteDetailResponse = {
  quote: AdminQuote;
  offers: AdminQuoteOffer[];
};