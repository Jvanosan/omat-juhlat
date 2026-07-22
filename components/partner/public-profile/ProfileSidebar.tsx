import Link from "next/link";

import {
  ExternalLink,
  InfoRow,
} from "./ProfileElements";

import type { PublicPartner } from "./types";

type ProfileSidebarProps = {
  partner: PublicPartner;
};

export default function ProfileSidebar({
  partner,
}: ProfileSidebarProps) {
  const guestCapacity =
    getGuestCapacity(partner);

  const hasExternalLinks = Boolean(
    partner.website ||
      partner.instagram_url ||
      partner.facebook_url ||
      partner.tiktok_url,
  );

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-[#e8ded0] bg-[#fffdf9] p-6">
        <h2 className="text-xl font-bold text-[#211b16]">
          Yrityksen tiedot
        </h2>

        <div className="mt-5 divide-y divide-[#eee5d9]">
          {partner.area && (
            <InfoRow
              label="Sijainti"
              value={partner.area}
              icon="📍"
            />
          )}

          {partner.address && (
            <InfoRow
              label="Osoite"
              value={partner.address}
              icon="🏠"
            />
          )}

          {guestCapacity && (
            <InfoRow
              label="Vierasmäärä"
              value={guestCapacity}
              icon="👥"
            />
          )}

          {partner.avg_price_level && (
            <InfoRow
              label="Hintataso"
              value={
                partner.avg_price_level
              }
              icon="💶"
            />
          )}

          <InfoRow
            label="Pysäköinti"
            value={
              partner.parking === true
                ? "Saatavilla"
                : partner.parking === false
                  ? "Ei saatavilla"
                  : "Ei ilmoitettu"
            }
            icon="🚗"
          />

          <InfoRow
            label="Esteettömyys"
            value={
              partner.accessibility === true
                ? "Esteetön"
                : partner.accessibility === false
                  ? "Ei esteetön"
                  : "Ei ilmoitettu"
            }
            icon="♿"
          />
        </div>
      </div>

      {hasExternalLinks && (
        <div className="rounded-3xl border border-[#e8ded0] bg-white p-6">
          <h2 className="text-xl font-bold text-[#211b16]">
            Löydä yritys verkosta
          </h2>

          <div className="mt-4 grid gap-2">
            {partner.website && (
              <ExternalLink
                href={partner.website}
              >
                🌐 Verkkosivu
              </ExternalLink>
            )}

            {partner.instagram_url && (
              <ExternalLink
                href={
                  partner.instagram_url
                }
              >
                📸 Instagram
              </ExternalLink>
            )}

            {partner.facebook_url && (
              <ExternalLink
                href={
                  partner.facebook_url
                }
              >
                Facebook
              </ExternalLink>
            )}

            {partner.tiktok_url && (
              <ExternalLink
                href={
                  partner.tiktok_url
                }
              >
                TikTok
              </ExternalLink>
            )}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-[#e1cfad] bg-gradient-to-br from-[#fff8eb] to-[#f7ead5] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
          Kiinnostuitko?
        </p>

        <h2 className="mt-2 text-xl font-bold text-[#211b16]">
          Pyydä yritykseltä tarjous
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#70675e]">
          Yritys lisätään valintoihisi
          palveluntarjoajien selaussivulla.
        </p>

        <Link
          href={`/browse?select=${encodeURIComponent(
            partner.id,
          )}`}
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-5 py-3 text-center font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f783a] hover:shadow-md"
        >
          ✓ Valitse palveluntarjoaja
        </Link>

        <Link
          href="/browse"
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#d8c7ad] bg-white px-5 py-3 text-center font-bold text-[#795a28] transition hover:border-[#b48a45] hover:bg-[#fffdf9]"
        >
          ← Takaisin selaamaan
        </Link>
      </div>
    </aside>
  );
}

function getGuestCapacity(
  partner: PublicPartner,
): string | null {
  if (
    partner.min_guests &&
    partner.max_guests
  ) {
    return `${partner.min_guests}–${partner.max_guests} henkilöä`;
  }

  if (partner.max_guests) {
    return `Enintään ${partner.max_guests} henkilöä`;
  }

  if (partner.min_guests) {
    return `Vähintään ${partner.min_guests} henkilöä`;
  }

  return null;
}