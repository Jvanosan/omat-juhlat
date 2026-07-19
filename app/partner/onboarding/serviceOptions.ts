export type ServiceCategoryId =
  | "venue"
  | "catering"
  | "photography"
  | "dj"
  | "decoration"
  | "transport";

export type ServiceOption = {
  id: string;
  label: string;
};

export type ServiceCategory = {
  id: ServiceCategoryId;
  label: string;
  description: string;
  icon: string;
  options: ServiceOption[];
};

export const SERVICE_OPTIONS: ServiceCategory[] = [
  {
    id: "venue",
    label: "Juhlatila",
    description: "Tilat häihin, syntymäpäiviin ja yritystilaisuuksiin.",
    icon: "🏢",
    options: [
      {
        id: "accessible",
        label: "Esteetön sisäänkäynti",
      },
      {
        id: "parking",
        label: "Pysäköintimahdollisuus",
      },
      {
        id: "kitchen",
        label: "Keittiö käytettävissä",
      },
      {
        id: "outdoor_area",
        label: "Ulkotila",
      },
      {
        id: "accommodation",
        label: "Majoitusmahdollisuus",
      },
      {
        id: "own_catering_allowed",
        label: "Oma catering sallittu",
      },
      {
        id: "sound_system",
        label: "Äänentoistojärjestelmä",
      },
      {
        id: "projector",
        label: "Projektori tai näyttö",
      },
    ],
  },
  {
    id: "catering",
    label: "Catering",
    description: "Ruokatarjoilu yksityisiin ja yritystilaisuuksiin.",
    icon: "🍽️",
    options: [
      {
        id: "buffet",
        label: "Buffet",
      },
      {
        id: "table_service",
        label: "Pöytiintarjoilu",
      },
      {
        id: "fine_dining",
        label: "Fine dining",
      },
      {
        id: "vegan",
        label: "Vegaaniset vaihtoehdot",
      },
      {
        id: "vegetarian",
        label: "Kasvisvaihtoehdot",
      },
      {
        id: "gluten_free",
        label: "Gluteenittomat vaihtoehdot",
      },
      {
        id: "staff_available",
        label: "Tarjoiluhenkilökunta saatavilla",
      },
      {
        id: "delivery",
        label: "Kuljetus tapahtumapaikalle",
      },
    ],
  },
  {
    id: "photography",
    label: "Valokuvaus",
    description: "Tapahtuma-, hää- ja juhlakuvaukset.",
    icon: "📷",
    options: [
      {
        id: "weddings",
        label: "Häät",
      },
      {
        id: "birthdays",
        label: "Syntymäpäivät",
      },
      {
        id: "corporate_events",
        label: "Yritystilaisuudet",
      },
      {
        id: "portraits",
        label: "Muotokuvat",
      },
      {
        id: "video",
        label: "Videokuvaus",
      },
      {
        id: "drone",
        label: "Drone-kuvaus",
      },
      {
        id: "same_day_preview",
        label: "Kuvien ennakkotoimitus samana päivänä",
      },
    ],
  },
  {
    id: "dj",
    label: "DJ",
    description: "Musiikki ja tunnelma erilaisiin juhliin.",
    icon: "🎵",
    options: [
      {
        id: "weddings",
        label: "Häät",
      },
      {
        id: "birthdays",
        label: "Syntymäpäivät",
      },
      {
        id: "corporate_events",
        label: "Yritystilaisuudet",
      },
      {
        id: "own_equipment",
        label: "Omat äänentoistolaitteet",
      },
      {
        id: "lighting",
        label: "Valotekniikka",
      },
      {
        id: "microphones",
        label: "Mikrofonit",
      },
      {
        id: "custom_playlist",
        label: "Toivekappaleet ja oma soittolista",
      },
    ],
  },
  {
    id: "decoration",
    label: "Koristelu",
    description: "Juhlatilan koristelu, somistus ja kukat.",
    icon: "🎈",
    options: [
      {
        id: "weddings",
        label: "Hääkoristelu",
      },
      {
        id: "birthdays",
        label: "Syntymäpäiväkoristelu",
      },
      {
        id: "corporate_events",
        label: "Yritystilaisuudet",
      },
      {
        id: "flowers",
        label: "Kukka-asetelmat",
      },
      {
        id: "balloons",
        label: "Ilmapallokoristelu",
      },
      {
        id: "table_decorations",
        label: "Pöytäkoristelut",
      },
      {
        id: "setup",
        label: "Koristelujen asennus",
      },
      {
        id: "teardown",
        label: "Koristelujen purku",
      },
    ],
  },
  {
    id: "transport",
    label: "Kuljetus",
    description: "Henkilö- ja juhlakuljetukset tapahtumiin.",
    icon: "🚗",
    options: [
      {
        id: "wedding_car",
        label: "Hääauto",
      },
      {
        id: "limousine",
        label: "Limusiini",
      },
      {
        id: "minibus",
        label: "Minibussi",
      },
      {
        id: "bus",
        label: "Linja-auto",
      },
      {
        id: "airport_transfer",
        label: "Lentokenttäkuljetus",
      },
      {
        id: "multiple_stops",
        label: "Useita pysähdyksiä",
      },
      {
        id: "accessible_vehicle",
        label: "Esteetön ajoneuvo",
      },
    ],
  },
];

export function getServiceCategory(
  categoryId: ServiceCategoryId
): ServiceCategory | undefined {
  return SERVICE_OPTIONS.find(
    (category) => category.id === categoryId
  );
}