export type BrowsePartner = {
  id: string;
  company: string;
  area: string | null;
  category: unknown;
  services: unknown;
  images?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  slug: string | null;
};

export type PartnerAreaGroup = Record<
  string,
  BrowsePartner[]
>;

export type GroupedPartners = Record<
  string,
  PartnerAreaGroup
>;

export type SelectionToast = {
  partnerId: string;
  company: string;
};

export type AvailabilityState =
  | "unknown"
  | "loading"
  | "available"
  | "unavailable";

export type DirectRequestResult = {
  success?: boolean;
  requestId?: string;
  accessToken?: string;
  error?: string;
};