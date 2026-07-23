import {
  FINNISH_LOCATIONS,
} from "@/lib/locations";

import {
  SERVICE_OPTIONS,
} from "@/lib/services";

export { EVENT_TYPES } from "@/lib/events";

export const LOCATIONS = [
  ...FINNISH_LOCATIONS,
];


export const CANONICAL_SERVICE_LABELS =
  SERVICE_OPTIONS.map(
    (category) =>
      category.label,
  );

export const SERVICE_NAMES: Record<
  string,
  string
> = {
  /*
   * Viralliset tunnisteet
   */
  venue: "Juhlatila",
  catering: "Catering",
  photography: "Valokuvaus",
  dj: "DJ",
  decoration: "Koristelu",
  transport: "Kuljetus",

  /*
   * Virallisten kategorioiden
   * suomenkieliset nimet
   */
  juhlatila: "Juhlatila",
  valokuvaus: "Valokuvaus",
  koristelu: "Koristelu",
  kuljetus: "Kuljetus",

  /*
   * Vanhat tekniset nimet samoille
   * kuudelle kategorialle. Nämä voidaan
   * poistaa demodatan siivouksen jälkeen.
   */
  photographer: "Valokuvaus",
  decor: "Koristelu",
};

export const TOAST_DURATION_MS =
  3500;