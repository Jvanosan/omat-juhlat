import type { ServiceCategoryId } from "./serviceOptions";
import type { PricingUnit } from "./pricingTemplates";

export type CompanyDetails = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  description: string;
};

export type PricingItem = {
  id: string;
  categoryId: ServiceCategoryId;
  templateId: string;
  label: string;
  description: string;
  price: string;
  unit: PricingUnit;
};

export type OnboardingForm = {
  company: CompanyDetails;

  logoUrl: string;
  coverImageUrl: string;
  galleryUrls: string[];

  selectedCategories: ServiceCategoryId[];
  selectedOptions: Record<string, string[]>;

  pricingItems: PricingItem[];
};

export type SubmitState = {
  loading: boolean;
  error: string;
};

export type ValidationResult = {
  valid: boolean;
  message?: string;
};