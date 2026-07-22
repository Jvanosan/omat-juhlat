export type OfferSortOption =
  | "price"
  | "rating"
  | "newest";

export type CustomerQuote = {
  id?: number | string;
  date: string | null;
  location: string | null;
  guests: number | null;
  status: string | null;
};

export type OfferPartner = {
  id?: string;
  company: string | null;
  images: string | null;
  averageRating: string | null;
  reviewCount: number;
};

export type CustomerOffer = {
  id: number | string;
  status: string | null;
  service: string | null;
  offer_price: number | null;
  offer_message: string | null;
  expires_at: string | null;
  created_at: string;
  partner_id?: string;
  partner: OfferPartner | null;
};

export type OffersByService =
  Record<string, CustomerOffer[]>;

export type CustomerQuoteApiResponse = {
  quote?: CustomerQuote | null;
  offers?: CustomerOffer[];
  error?: string;
};

export type SelectOfferApiResponse = {
  success?: boolean;
  error?: string;
};