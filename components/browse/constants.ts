import {
  FINNISH_LOCATIONS,
} from "@/lib/locations";

export const LOCATIONS = [
  ...FINNISH_LOCATIONS,
];

export const EVENT_TYPES = [
  "Häät",
  "Syntymäpäivä",
  "Valmistujaiset",
  "Yritysjuhla",
  "Ristiäiset",
  "Muu juhla",
] as const;

export const SERVICE_NAMES: Record<
  string,
  string
> = {
  juhlatila: "Juhlatila",
  "juhla tila": "Juhlatila",
  "juhla-tila": "Juhlatila",
  juhlatilat: "Juhlatila",

  catering: "Catering",
  ravintola: "Catering",
  ruokailu: "Catering",
  pitopalvelu: "Catering",

  dj: "DJ / Musiikki",
  musiikki: "DJ / Musiikki",
  "dj musiikki": "DJ / Musiikki",
  "dj & musiikki": "DJ / Musiikki",
  "dj / musiikki": "DJ / Musiikki",

  band: "Bändi / live-musiikki",
  bändi: "Bändi / live-musiikki",
  yhtye: "Bändi / live-musiikki",
  "live-musiikki":
    "Bändi / live-musiikki",

  photographer: "Valokuvaus",
  valokuvaaja: "Valokuvaus",
  valokuvaus: "Valokuvaus",
  kuvaaja: "Valokuvaus",

  decor: "Somistus / Koristelu",
  somistus: "Somistus / Koristelu",
  koristelu: "Somistus / Koristelu",

  "event planner":
    "Tapahtumasuunnittelu",
  tapahtumasuunnittelu:
    "Tapahtumasuunnittelu",

  leipomo: "Leipomo / Kakut",
  kakut: "Leipomo / Kakut",
  "leipomo kakut":
    "Leipomo / Kakut",
};

export const TOAST_DURATION_MS = 3500;