import type { ServiceCategoryId } from "./serviceOptions";

export type PricingUnit =
  | "fixed"
  | "per_person"
  | "per_hour"
  | "per_day"
  | "per_kilometer"
  | "starting_from";

export type PricingTemplateItem = {
  id: string;
  label: string;
  description?: string;
  defaultUnit: PricingUnit;
};

export type PricingTemplate = {
  categoryId: ServiceCategoryId;
  categoryLabel: string;
  items: PricingTemplateItem[];
};

export const PRICING_UNIT_LABELS: Record<PricingUnit, string> = {
  fixed: "Kiinteä hinta",
  per_person: "Hinta / henkilö",
  per_hour: "Hinta / tunti",
  per_day: "Hinta / päivä",
  per_kilometer: "Hinta / kilometri",
  starting_from: "Alkaen-hinta",
};

export const PRICING_TEMPLATES: PricingTemplate[] = [
  {
    categoryId: "venue",
    categoryLabel: "Juhlatilat",
    items: [
      {
        id: "weekday",
        label: "Arkipäivä",
        description: "Maanantai–torstai",
        defaultUnit: "fixed",
      },
      {
        id: "friday",
        label: "Perjantai",
        defaultUnit: "fixed",
      },
      {
        id: "saturday",
        label: "Lauantai",
        defaultUnit: "fixed",
      },
      {
        id: "sunday",
        label: "Sunnuntai",
        defaultUnit: "fixed",
      },
      {
        id: "weekend_package",
        label: "Viikonloppupaketti",
        description: "Esimerkiksi perjantaista sunnuntaihin",
        defaultUnit: "fixed",
      },
      {
        id: "hourly_rental",
        label: "Tuntivuokra",
        defaultUnit: "per_hour",
      },
    ],
  },
  {
    categoryId: "catering",
    categoryLabel: "Ruoka & juoma",
    items: [
      {
        id: "basic_buffet",
        label: "Perusbuffet",
        defaultUnit: "per_person",
      },
      {
        id: "premium_buffet",
        label: "Premium-buffet",
        defaultUnit: "per_person",
      },
      {
        id: "fine_dining",
        label: "Fine dining",
        defaultUnit: "per_person",
      },
      {
        id: "coffee_service",
        label: "Kahvitarjoilu",
        defaultUnit: "per_person",
      },
      {
        id: "delivery_fee",
        label: "Kuljetusmaksu",
        defaultUnit: "fixed",
      },
      {
        id: "service_staff",
        label: "Tarjoiluhenkilökunta",
        defaultUnit: "per_hour",
      },
    ],
  },
  {
    categoryId: "music_and_performers",
    categoryLabel: "Musiikki & esiintyjät",
    items: [
      {
        id: "short_event",
        label: "Lyhyt esitys / keikka",
        description: "Esimerkiksi enintään 1–2 tuntia",
        defaultUnit: "fixed",
      },
      {
        id: "evening_package",
        label: "Iltapaketti",
        defaultUnit: "fixed",
      },
      {
        id: "full_event",
        label: "Koko juhlan paketti",
        defaultUnit: "fixed",
      },
      {
        id: "hourly",
        label: "Tuntihinta",
        defaultUnit: "per_hour",
      },
      {
        id: "sound_equipment",
        label: "Äänentoistolaitteet",
        defaultUnit: "fixed",
      },
    ],
  },
  {
    categoryId: "entertainment",
    categoryLabel: "Ohjelma & elämykset",
    items: [
      {
        id: "program_package",
        label: "Ohjelmanumero / esitys",
        defaultUnit: "fixed",
      },
      {
        id: "hourly_hosting",
        label: "Juontu / ohjaus tunneittain",
        defaultUnit: "per_hour",
      },
      {
        id: "full_day_entertainment",
        label: "Koko päivän ohjelmapaketti",
        defaultUnit: "fixed",
      },
    ],
  },
  {
    categoryId: "photography",
    categoryLabel: "Kuvaus & media",
    items: [
      {
        id: "short_session",
        label: "Lyhyt kuvaus",
        description: "Esimerkiksi 1–2 tuntia",
        defaultUnit: "fixed",
      },
      {
        id: "half_day",
        label: "Puolen päivän kuvaus",
        defaultUnit: "fixed",
      },
      {
        id: "full_day",
        label: "Koko päivän kuvaus",
        defaultUnit: "fixed",
      },
      {
        id: "hourly",
        label: "Tuntihinta",
        defaultUnit: "per_hour",
      },
      {
        id: "video_package",
        label: "Videokuvauspaketti",
        defaultUnit: "fixed",
      },
      {
        id: "drone_package",
        label: "Drone-kuvaus",
        defaultUnit: "fixed",
      },
    ],
  },
  {
    categoryId: "decoration",
    categoryLabel: "Somistus & kukat",
    items: [
      {
        id: "basic_package",
        label: "Peruskoristelupaketti",
        defaultUnit: "fixed",
      },
      {
        id: "premium_package",
        label: "Premium-koristelupaketti",
        defaultUnit: "fixed",
      },
      {
        id: "table_decorations",
        label: "Pöytäkoristelut",
        defaultUnit: "starting_from",
      },
      {
        id: "flower_arrangements",
        label: "Kukka-asetelmat",
        defaultUnit: "starting_from",
      },
      {
        id: "setup_and_teardown",
        label: "Asennus ja purku",
        defaultUnit: "fixed",
      },
    ],
  },
  {
    categoryId: "equipment",
    categoryLabel: "Tekniikka & kalusto",
    items: [
      {
        id: "equipment_package",
        label: "Vuokrapaketti",
        defaultUnit: "fixed",
      },
      {
        id: "daily_rental",
        label: "Päivävuokra",
        defaultUnit: "per_day",
      },
      {
        id: "delivery_and_setup",
        label: "Toimitus ja pystytys",
        defaultUnit: "fixed",
      },
    ],
  },
  {
    categoryId: "transport",
    categoryLabel: "Kuljetus",
    items: [
      {
        id: "wedding_car",
        label: "Hääautopaketti",
        defaultUnit: "fixed",
      },
      {
        id: "limousine",
        label: "Limusiinipaketti",
        defaultUnit: "fixed",
      },
      {
        id: "minibus",
        label: "Minibussikuljetus",
        defaultUnit: "fixed",
      },
      {
        id: "bus",
        label: "Linja-autokuljetus",
        defaultUnit: "fixed",
      },
      {
        id: "hourly",
        label: "Tuntihinta",
        defaultUnit: "per_hour",
      },
      {
        id: "per_kilometer",
        label: "Kilometrihinta",
        defaultUnit: "per_kilometer",
      },
    ],
  },
  {
    categoryId: "beauty_and_wellness",
    categoryLabel: "Kauneus & hyvinvointi",
    items: [
      {
        id: "makeup_and_hair",
        label: "Meikki ja kampaus paketti",
        defaultUnit: "fixed",
      },
      {
        id: "trial_session",
        label: "Koeajo / harjoituskerta",
        defaultUnit: "fixed",
      },
      {
        id: "hourly_service",
        label: "Palvelu tunneittain",
        defaultUnit: "per_hour",
      },
    ],
  },
  {
    categoryId: "planning_and_production",
    categoryLabel: "Suunnittelu & tuotanto",
    items: [
      {
        id: "full_planning",
        label: "Kokonaisvaltainen suunnittelu",
        defaultUnit: "fixed",
      },
      {
        id: "coordination_day",
        label: "Hääpäivän / tapahtuman koordinointi",
        defaultUnit: "fixed",
      },
      {
        id: "consultation_hour",
        label: "Konsultaatio",
        defaultUnit: "per_hour",
      },
    ],
  },
];

export function getPricingTemplate(
  categoryId: ServiceCategoryId
): PricingTemplate | undefined {
  return PRICING_TEMPLATES.find(
    (template) => template.categoryId === categoryId
  );
}