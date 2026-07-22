export type PartnerDashboardProfile = {
  id: string;
  company: string | null;
  status: string | null;
  verified: boolean | null;
  profile_completed: boolean | null;
  profile_completion: number | null;
  published_at: string | null;
  average_rating: number | string | null;
  review_count: number | null;
  slug: string | null;
};

export type PartnerDashboardStats = {
  newRequests: number;
  sentOffers: number;
  acceptedOffers: number;
  averageRating: string;
  reviewCount: number;
};

export type DashboardStatItem = {
  label: string;
  value: number | string;
  icon: string;
  href: string;
  tone:
    | "gold"
    | "blue"
    | "green"
    | "rose";
};

export type DashboardQuickAction = {
  title: string;
  description: string;
  href: string;
  icon: string;
};