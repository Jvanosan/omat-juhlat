import type { OnboardingForm } from "./types";

export const TOTAL_STEPS = 5;

export const STEP_TITLES = [
  "Yritys",
  "Kuvat",
  "Palvelut",
  "Hinnoittelu",
  "Tarkistus",
];

export const MAX_GALLERY_IMAGES = 10;

export const DEFAULT_FORM: OnboardingForm = {
  company: {
  companyName: "",
  contactName: "",
  businessId: "",

  email: "",
  phone: "",
  website: "",

  city: "",
  address: "",
  postalCode: "",
  operatingRangeKm: "",

  minGuests: "",
  maxGuests: "",
  avgPriceLevel: "",

  parking: false,
  accessibility: false,

  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  openingHours: "",

  description: "",
},

  logoUrl: "",
  coverImageUrl: "",
  galleryUrls: [],

  selectedCategories: [],
  selectedOptions: {},

  pricingItems: [],
};