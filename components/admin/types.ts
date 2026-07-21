export type AdminPartner = {
  id: string;
  company: string;
  email: string | null;
  area: string | null;
  max_guests: number | null;
  status: string;
};

export type AdminQuote = {
  id: number | string;
  date: string | null;
  location: string | null;
  guests: number | null;
  status: string | null;
  offerCount: number;
};
export type AdminDirectRequestSummary = {
  id: string;
  event_date: string | null;
  location: string | null;
  guests: number | null;
  event_type: string | null;
  status: string | null;
  offerCount: number;
};
export type PartnerApplication = {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  description: string | null;
  service_category: string | null;
  city: string | null;
  status: string;
};

export type ReviewPartner = {
  company: string;
};

export type AdminReview = {
  id: string;
  partner_id: string;
  customer_email: string | null;
  rating: number;
  review: string | null;
  approved: boolean;
  created_at: string;
  partners:
    | ReviewPartner
    | ReviewPartner[]
    | null;
};

export type AdminDashboardData = {
  partners: AdminPartner[];
  requests: AdminQuote[];
  directRequests: AdminDirectRequestSummary[];
  applications: PartnerApplication[];
  pendingReviews: AdminReview[];
  approvedReviews: AdminReview[];
};
export type PartnerStatus =
  | "pending"
  | "approved"
  | "rejected";

export type QuoteStatus =
  | "avoin"
  | "käsittelyssä"
  | "suljettu";