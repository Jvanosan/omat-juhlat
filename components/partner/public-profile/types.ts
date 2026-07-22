export type PublicPartner = {
  id: string;
  company: string;
  description: string | null;
  category: unknown;
  services: unknown;
  area: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  images: unknown;
  min_guests: number | null;
  max_guests: number | null;
  avg_price_level: string | null;
  parking: boolean | null;
  accessibility: boolean | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  opening_hours: string | null;
  slug: string | null;
};

export type PublicPartnerReview = {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
};

export type PartnerProfileData = {
  partner: PublicPartner;
  reviews: PublicPartnerReview[];
  services: string[];
  galleryImages: string[];
  mainImage: string;
  averageRating: string | null;
};