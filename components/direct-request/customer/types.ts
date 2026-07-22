import type {
  OfferPartner,
} from "@/components/quote/customer/types";

export type DirectRequestDetails = {
  id: string;
  event_date: string | null;
  location: string | null;
  guests: number | null;
  event_type: string | null;
  status: string | null;
};

export type DirectOfferApiRow = {
  id: string;
  direct_request_id?: string;
  partner_id?: string;
  price: number | null;
  message: string | null;
  status: string | null;
  expires_at: string | null;
  created_at: string;
  partner: OfferPartner | null;
};

export type DirectRequestApiResponse = {
  request?: DirectRequestDetails | null;
  offers?: DirectOfferApiRow[];
  error?: string;
};

export type DirectOfferSelectionResponse = {
  success?: boolean;
  selectedOfferId?: string;
  customerEmailSent?: boolean;
  partnerEmailSent?: boolean;
  error?: string;
};