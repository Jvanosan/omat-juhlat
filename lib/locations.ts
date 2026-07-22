export const FINNISH_LOCATIONS = [
  "Helsinki",
  "Espoo",
  "Vantaa",
  "Tampere",
  "Turku",
  "Oulu",
  "Jyväskylä",
  "Lahti",
  "Kuopio",
  "Joensuu",
  "Pori",
  "Vaasa",
  "Rovaniemi",
  "Seinäjoki",
  "Lappeenranta",
  "Kotka",
  "Mikkeli",
  "Hämeenlinna",
  "Salo",
  "Kokkola",
  "Kajaani",
  "Rauma",
  "Porvoo",
  "Hyvinkää",
  "Järvenpää",
  "Lohja",
  "Kerava",
  "Tuusula",
  "Nurmijärvi",
  "Ylöjärvi",
  "Nokia",
  "Kangasala",
  "Riihimäki",
  "Savonlinna",
  "Imatra",
  "Raahe",
  "Iisalmi",
  "Varkaus",
  "Kemi",
  "Tornio",
  "Pietarsaari",
  "Forssa",
  "Valkeakoski",
  "Kuusamo",
  "Kempele",
  "Sipoo",
  "Kirkkonummi",
  "Vihti",
  "Lempäälä",
  "Pirkkala",
] as const;

export const PARTNER_SERVICE_AREAS = [
  "Koko Suomi",
  ...FINNISH_LOCATIONS,
] as const;

export function parseServiceAreas(
  value: string | null | undefined,
): string[] {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(/[,;]+/)
        .map((area) => area.trim())
        .filter(Boolean),
    ),
  );
}

export function serializeServiceAreas(
  areas: string[],
): string {
  return Array.from(
    new Set(
      areas
        .map((area) => area.trim())
        .filter(Boolean),
    ),
  ).join(", ");
}