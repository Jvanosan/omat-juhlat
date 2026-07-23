export type ConfirmationQuote = {
  id: number;
  status: string | null;
  date: string | null;
  event_type: string | null;
  location: string | null;
  guests: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
};

export type QuotePartnerOffer = {
  id: number;
  partner_id: string;
  service: string | null;
  status: string | null;
  offer_price: number | null;
  offer_message: string | null;
  expires_at: string | null;
};

export type ConfirmationPartner = {
  id: string;
  company: string | null;
  email: string | null;
};

export type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export type ConfirmationEmailResult = {
  winnerEmailsSent: number;
  loserEmailsSent: number;
  customerEmailSent: boolean;
};