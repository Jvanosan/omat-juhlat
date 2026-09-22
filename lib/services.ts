export type ServiceCategoryId =
  | "venue"
  | "catering"
  | "music_and_performers"
  | "entertainment"
  | "photography"
  | "decoration"
  | "equipment"
  | "transport"
  | "beauty_and_wellness"
  | "planning_and_production";

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
    label: "Juhlatilat",
    description: "Tilat häihin, syntymäpäiviin ja yritystilaisuuksiin.",
    icon: "🏛️",
    options: [
      { id: "accessible", label: "Esteetön sisäänkäynti" },
      { id: "parking", label: "Pysäköintimahdollisuus" },
      { id: "kitchen", label: "Keittiö käytettävissä" },
      { id: "outdoor_area", label: "Ulkotila" },
      { id: "accommodation", label: "Majoitusmahdollisuus" },
      { id: "own_catering_allowed", label: "Oma catering sallittu" },
      { id: "sound_system", label: "Äänentoistojärjestelmä" },
      { id: "projector", label: "Projektori tai näyttö" },
    ],
  },
  {
    id: "catering",
    label: "Ruoka & juoma",
    description: "Ruoka- ja juomatarjoilut yksityisiin ja yritystilaisuuksiin.",
    icon: "🍽️",
    options: [
      { id: "buffet", label: "Buffet" },
      { id: "table_service", label: "Pöytiintarjoilu" },
      { id: "fine_dining", label: "Fine dining" },
      { id: "vegan", label: "Vegaaniset vaihtoehdot" },
      { id: "vegetarian", label: "Kasvisvaihtoehdot" },
      { id: "gluten_free", label: "Gluteenittomat vaihtoehdot" },
      { id: "staff_available", label: "Tarjoiluhenkilökunta saatavilla" },
      { id: "delivery", label: "Kuljetus tapahtumapaikalle" },
    ],
  },
  {
    id: "music_and_performers",
    label: "Musiikki & esiintyjät",
    description: "DJ:t, bändit, trubaduurit ja muut esiintyjät.",
    icon: "🎵",
    options: [
      { id: "dj", label: "DJ-palvelut" },
      { id: "band", label: "Bändi tai yhtye" },
      { id: "duo", label: "Duo" },
      { id: "troubadour", label: "Trubaduuri" },
      { id: "own_equipment", label: "Omat äänentoistolaitteet" },
      { id: "lighting", label: "Valotekniikka" },
      { id: "custom_playlist", label: "Toivekappaleet ja räätälöity ohjelmisto" },
    ],
  },
  {
    id: "entertainment",
    label: "Ohjelma & elämykset",
    description: "Juontajat, taikurit, koomikot ja elämyksellinen ohjelma.",
    icon: "🎭",
    options: [
      { id: "host", label: "Juontaja" },
      { id: "magician", label: "Taikuri" },
      { id: "comedian", label: "Koomikko" },
      { id: "activities", label: "Aktiviteetit ja pelit" },
      { id: "workshops", label: "Työpajat" },
      { id: "custom_program", label: "Räätälöity ohjelmanumero" },
    ],
  },
  {
    id: "photography",
    label: "Kuvaus & media",
    description: "Valokuvaus, videokuvaus ja tallenteet juhlista.",
    icon: "📸",
    options: [
      { id: "weddings", label: "Hääkuvaus" },
      { id: "birthdays", label: "Syntymäpäivät" },
      { id: "corporate_events", label: "Yritystilaisuudet" },
      { id: "video", label: "Videokuvaus" },
      { id: "drone", label: "Drone-kuvaus" },
      { id: "photobooth", label: "Photobooth / kuvaseinä" },
      { id: "same_day_preview", label: "Kuvien ennakkotoimitus" },
    ],
  },
  {
    id: "decoration",
    label: "Somistus & kukat",
    description: "Juhlatilan somistus, ilmapallot ja kukkakoristelut.",
    icon: "🎈",
    options: [
      { id: "weddings", label: "Hääkoristelu" },
      { id: "flowers", label: "Kukka-asetelmat" },
      { id: "balloons", label: "Ilmapallokoristelu" },
      { id: "table_decorations", label: "Pöytäkoristelut ja kattaukset" },
      { id: "setup", label: "Koristelujen asennus" },
      { id: "teardown", label: "Koristelujen purku" },
    ],
  },
  {
    id: "equipment",
    label: "Tekniikka & kalusto",
    description: "Äänentoisto, valaistus, teltat ja kalustevuokraus.",
    icon: "💡",
    options: [
      { id: "sound_system", label: "Äänentoistolaitteet" },
      { id: "lighting", label: "Valotekniikka ja tunnelmavalaistus" },
      { id: "furniture", label: "Pöydät ja tuolit" },
      { id: "tent", label: "Juhlateltat" },
      { id: "delivery_and_setup", label: "Toimitus ja pystytys" },
    ],
  },
  {
    id: "transport",
    label: "Kuljetus",
    description: "Hääautot, limusiinit, bussit ja tila-autot.",
    icon: "🚐",
    options: [
      { id: "wedding_car", label: "Hääauto" },
      { id: "limousine", label: "Limusiini" },
      { id: "minibus", label: "Minibussi" },
      { id: "bus", label: "Linja-auto" },
      { id: "airport_transfer", label: "Kuljetukset juhlapaikalle" },
      { id: "accessible_vehicle", label: "Esteetön ajoneuvo" },
    ],
  },
  {
    id: "beauty_and_wellness",
    label: "Kauneus & hyvinvointi",
    description: "Meikkaus, kampaukset ja hemmottelupalvelut juhlapäivään.",
    icon: "💄",
    options: [
      { id: "makeup", label: "Juhlameikki" },
      { id: "hairdressing", label: "Juhlakampaus" },
      { id: "trial", label: "Koe meikki / kampaus" },
      { id: "wellness", label: "Hyvinvointipalvelut" },
    ],
  },
  {
    id: "planning_and_production",
    label: "Suunnittelu & tuotanto",
    description: "Tapahtumasuunnittelu, hääsuunnittelu ja tuotanto.",
    icon: "📋",
    options: [
      { id: "wedding_planning", label: "Hääsuunnittelu" },
      { id: "event_coordination", label: "Tapahtumakoordinointi paikan päällä" },
      { id: "full_production", label: "Kokonaisvaltainen tuotanto" },
      { id: "consultation", label: "Suunnittelu konsultaatio" },
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