import {
  SERVICE_OPTIONS,
} from "@/lib/services";
export type PartnerApplicationForm = {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  description: string;
  service_category: string;
  city: string;
  website: string;
  notes: string;
};

export type ApplicationSubmitState = {
  loading: boolean;
  error: string;
  success: boolean;
};

export const DEFAULT_APPLICATION_FORM: PartnerApplicationForm = {
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
  description: "",
  service_category: "",
  city: "",
  website: "",
  notes: "",
};

export const PARTNER_SERVICE_CATEGORIES =
  SERVICE_OPTIONS.map(
    (category) =>
      category.label,
  );