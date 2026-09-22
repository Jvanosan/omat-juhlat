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
   * Viralliset kategoriatunnisteet (lib/services.ts)
   */
  venue: "Juhlatilat",
  catering: "Ruoka & juoma",
  music_and_performers: "Musiikki & esiintyjät",
  entertainment: "Ohjelma & elämykset",
  photography: "Kuvaus & media",
  decoration: "Somistus & kukat",
  equipment: "Tekniikka & kalusto",
  transport: "Kuljetus",
  beauty_and_wellness: "Kauneus & hyvinvointi",
  planning_and_production: "Suunnittelu & tuotanto",

  /*
   * Vanhat / vaihtoehtoiset tunnisteet taaksepäin yhteensopivuutta varten
   */
  dj: "Musiikki & esiintyjät",
  valokuvaus: "Kuvaus & media",
  juhlatila: "Juhlatilat",
  koristelu: "Somistus & kukat",
  kuljetus: "Kuljetus",
  photographer: "Kuvaus & media",
  decor: "Somistus & kukat",
};

export const TOAST_DURATION_MS =
  3500;