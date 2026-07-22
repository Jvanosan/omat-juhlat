import type {
  DashboardQuickAction,
  PartnerDashboardProfile,
} from "./types";

export const DASHBOARD_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    title: "Vastaa tarjouspyyntöihin",
    description:
      "Katso uudet pyynnöt ja lähetä tai muokkaa tarjouksiasi.",
    href: "/partner/quotes",
    icon: "📨",
  },
  {
    title: "Muokkaa yritysprofiilia",
    description:
      "Päivitä yrityksen tiedot, palvelut, toiminta-alueet ja kuvat.",
    href: "/partner/profile",
    icon: "✏️",
  },
  {
    title: "Päivitä saatavuus",
    description:
      "Merkitse kalenteriin vapaat ja varatut päivät.",
    href: "/partner/calendar",
    icon: "📅",
  },
  {
    title: "Tarkista asetukset",
    description:
      "Hallitse käyttäjätiliä ja ilmoitusasetuksia.",
    href: "/partner/settings",
    icon: "⚙️",
  },
];

export function normalizeStatus(
  status: string | null | undefined,
): string {
  return (
    status
      ?.trim()
      .toLowerCase() ?? ""
  );
}

export function hasValidOfferPrice(
  value: unknown,
): boolean {
  const price = Number(value);

  return (
    Number.isFinite(price) &&
    price > 0
  );
}

export function isAcceptedOfferStatus(
  status: string | null | undefined,
): boolean {
  return [
    "accepted",
    "approved",
    "won",
    "confirmed",
    "selected",
    "valittu",
    "hyväksytty",
    "hyvaksytty",
    "vahvistettu",
  ].includes(normalizeStatus(status));
}

export function isSubmittedDirectOffer(
  status: string | null | undefined,
): boolean {
  return [
    "sent",
    "accepted",
    "rejected",
    "withdrawn",
    "expired",
  ].includes(normalizeStatus(status));
}

export function isPublishedPartner(
  partner: PartnerDashboardProfile | null,
): boolean {
  if (!partner) {
    return false;
  }

  const status = normalizeStatus(
    partner.status,
  );

  return (
    partner.verified === true ||
    Boolean(partner.published_at) ||
    [
      "active",
      "approved",
      "published",
      "hyväksytty",
      "hyvaksytty",
    ].includes(status)
  );
}

export function getProfileCompletion(
  partner: PartnerDashboardProfile | null,
): number {
  const value = Number(
    partner?.profile_completion,
  );

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round(value)),
  );
}

export function formatAverageRating(
  value: unknown,
): string {
  const rating = Number(value);

  if (
    !Number.isFinite(rating) ||
    rating <= 0
  ) {
    return "–";
  }

  return rating.toFixed(1);
}