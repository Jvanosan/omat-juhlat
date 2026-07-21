export type AdminDirectRequest = {
  id: string;
  created_at: string;
  updated_at: string | null;
  status: string | null;
  viewed: boolean;
  customer_name: string | null;
  email: string | null;
  phone: string | null;
  event_type: string | null;
  event_date: string | null;
  location: string | null;
  guests: number | null;
  budget: string | number | null;
  services: string | null;
  notes: string | null;
  partner_ids: string[] | null;
};

export type AdminDirectPartner = {
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

export type AdminDirectOffer = {
  id: string;
  direct_request_id: string;
  partner_id: string;
  price: number;
  message: string | null;
  status: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  partner: AdminDirectPartner | null;
};

export type AdminDirectRequestDetailResponse = {
  request: AdminDirectRequest;
  offers: AdminDirectOffer[];
  assignedPartners: AdminDirectPartner[];
};