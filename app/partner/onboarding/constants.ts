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
    email: "",
    phone: "",
    website: "",
    city: "",
    description: "",
  },

  logoUrl: "",
  coverImageUrl: "",
  galleryUrls: [],

  selectedCategories: [],
  selectedOptions: {},

  pricingItems: [],
};