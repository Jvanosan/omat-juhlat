export type PartnerNavigationItem = {
  label: string;
  shortLabel: string;
  href: string;
  icon: string;
  description: string;
};

export const PARTNER_NAVIGATION: PartnerNavigationItem[] = [
  {
    label: "Dashboard",
    shortLabel: "Etusivu",
    href: "/partner/dashboard",
    icon: "🏠",
    description: "Yrityksesi yhteenveto",
  },
  {
    label: "Tarjouspyynnöt",
    shortLabel: "Pyynnöt",
    href: "/partner/quotes",
    icon: "📨",
    description: "Asiakkaiden tarjouspyynnöt",
  },
  {
    label: "Yritysprofiili",
    shortLabel: "Profiili",
    href: "/partner/profile",
    icon: "👤",
    description: "Tiedot, kuvat ja palvelut",
  },
  {
    label: "Kalenteri",
    shortLabel: "Kalenteri",
    href: "/partner/calendar",
    icon: "📅",
    description: "Saatavuus ja varatut päivät",
  },
  {
    label: "Asetukset",
    shortLabel: "Asetukset",
    href: "/partner/settings",
    icon: "⚙️",
    description: "Tili ja ilmoitukset",
  },
];

export function isPartnerRouteActive(
  pathname: string,
  href: string,
): boolean {
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}