import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import ProfileHero from "@/components/partner/public-profile/ProfileHero";
import ProfileMainContent from "@/components/partner/public-profile/ProfileMainContent";
import ProfileSidebar from "@/components/partner/public-profile/ProfileSidebar";

import {
  calculateAverageRating,
  getPartnerProfileImages,
  getPublicPartnerServices,
} from "@/components/partner/public-profile/profileUtils";

import type {
  PublicPartner,
  PublicPartnerReview,
} from "@/components/partner/public-profile/types";

type PartnerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};
const SITE_URL = "https://www.omatjuhlat.fi";

export async function generateMetadata({
  params,
}: PartnerPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await supabase
    .from("public_partners")
    .select(`
      company,
      description,
      category,
      area,
      logo_url,
      cover_image_url,
      slug
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    return {
      title: "Palveluntarjoajaa ei löytynyt",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const company =
    toText(data.company) ||
    "Palveluntarjoaja";

  const category =
    toText(data.category) ||
    "Juhlapalvelut";

  const area = toText(data.area);

  const description =
    createMetaDescription(
      data.description,
      `Tutustu yrityksen ${company} juhlapalveluihin${
        area
          ? ` alueella ${area}`
          : ""
      } ja pyydä tarjous OmatJuhlat-palvelussa.`,
    );

  const profileUrl =
    `${SITE_URL}/partner/${encodeURIComponent(
      slug,
    )}`;

  const imageUrl =
    toAbsoluteUrl(
      data.cover_image_url,
    ) ||
    toAbsoluteUrl(data.logo_url);

  return {
    title: `${company} – ${category}${
      area ? `, ${area}` : ""
    }`,
    description,

    alternates: {
      canonical: profileUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: company,
      description,
      url: profileUrl,
      siteName: "OmatJuhlat",
      locale: "fi_FI",
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: `${company} – juhlapalvelut`,
            },
          ]
        : undefined,
    },

    twitter: {
      card: imageUrl
        ? "summary_large_image"
        : "summary",
      title: company,
      description,
      images: imageUrl
        ? [imageUrl]
        : undefined,
    },
  };
}
export default async function PartnerPage({
  params,
}: PartnerPageProps) {
  const { slug } = await params;

  const { data, error } =
    await supabase
      .from("public_partners")
      .select(`
        id,
        company,
        description,
        category,
        services,
        area,
        address,
        website,
        logo_url,
        cover_image_url,
        images,
        min_guests,
        max_guests,
        avg_price_level,
        parking,
        accessibility,
        instagram_url,
        facebook_url,
        tiktok_url,
        opening_hours,
        slug
      `)
      .eq("slug", slug)
      .maybeSingle();

  if (error) {
    console.error(
      "Partnerin julkisen profiilin lataus epäonnistui:",
      error,
    );

    notFound();
  }

  if (!data) {
    notFound();
  }

  const partner: PublicPartner = {
    ...data,
    id: String(data.id),
    company:
      data.company ||
      "Palveluntarjoaja",
  };

  const {
    data: reviewData,
    error: reviewsError,
  } = await supabase
    .from("partner_reviews")
    .select(`
      id,
      rating,
      review,
      created_at
    `)
    .eq("partner_id", partner.id)
    .eq("approved", true)
    .order("created_at", {
      ascending: false,
    });

  if (reviewsError) {
    console.error(
      "Partnerin arvostelujen lataus epäonnistui:",
      reviewsError,
    );
  }

  const reviews: PublicPartnerReview[] =
    (reviewData ?? []).map((review) => ({
      id: String(review.id),
      rating: Number(review.rating),
      review: review.review,
      created_at: review.created_at,
    }));

  const services =
    getPublicPartnerServices(partner);

  const {
    galleryImages,
    mainImage,
  } = getPartnerProfileImages(partner);

  const averageRating =
    calculateAverageRating(reviews);
  const profileUrl =
    `${SITE_URL}/partner/${encodeURIComponent(
      slug,
    )}`;

  const ratingValue =
    Number(averageRating);

  const sameAs = [
    externalUrl(partner.website),
    externalUrl(
      partner.instagram_url,
    ),
    externalUrl(
      partner.facebook_url,
    ),
    externalUrl(
      partner.tiktok_url,
    ),
  ].filter(
    (url): url is string =>
      Boolean(url),
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${profileUrl}#business`,

    name: partner.company,

    description:
      createMetaDescription(
        partner.description,
        `Tutustu yrityksen ${partner.company} juhlapalveluihin OmatJuhlat-palvelussa.`,
      ),

    url: profileUrl,

    image:
      toAbsoluteUrl(mainImage),

    logo:
      toAbsoluteUrl(
        partner.logo_url,
      ),

    areaServed:
      toText(partner.area) ||
      undefined,

    address: toText(
      partner.address,
    )
      ? {
          "@type":
            "PostalAddress",
          streetAddress: toText(
            partner.address,
          ),
          addressCountry: "FI",
        }
      : undefined,

    priceRange:
      toText(
        partner.avg_price_level,
      ) || undefined,

    sameAs:
      sameAs.length > 0
        ? sameAs
        : undefined,

    makesOffer:
      services.length > 0
        ? services.map(
            (service) => ({
              "@type": "Offer",
              itemOffered: {
                "@type":
                  "Service",
                name: service,
              },
            }),
          )
        : undefined,

    aggregateRating:
      reviews.length > 0 &&
      Number.isFinite(
        ratingValue,
      )
        ? {
            "@type":
              "AggregateRating",
            ratingValue,
            reviewCount:
              reviews.length,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };
  return (
    <>
          <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData,
          ).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <PublicHeader />

      <main className="min-h-screen bg-[#fbf8f2] text-[#211b16]">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/browse"
              className="inline-flex min-h-11 items-center rounded-xl border border-[#d8c7ad] bg-white px-4 py-2 text-sm font-bold text-[#795a28] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b48a45]"
            >
              ← Takaisin palveluihin
            </Link>

            <p className="inline-flex items-center gap-2 text-sm font-medium text-[#70675e]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#20a77c]"
              />

              Vahvistettu
              OmatJuhlat-palveluntarjoaja
            </p>
          </div>

          <article className="overflow-hidden rounded-[2rem] border border-[#e8ded0] bg-white shadow-[0_22px_65px_rgba(73,53,31,0.11)]">
            <ProfileHero
              partner={partner}
              mainImage={mainImage}
              services={services}
              averageRating={
                averageRating
              }
              reviewCount={
                reviews.length
              }
            />

            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-10">
              <ProfileMainContent
                partner={partner}
                galleryImages={
                  galleryImages
                }
                reviews={reviews}
              />

              <ProfileSidebar
                partner={partner}
              />
            </div>
          </article>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
function toText(
  value: unknown,
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is string =>
          typeof item === "string",
      )
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");
  }

  return "";
}

function createMetaDescription(
  value: unknown,
  fallback: string,
): string {
  const text =
    toText(value)
      .replace(/\s+/g, " ")
      .trim() || fallback;

  if (text.length <= 160) {
    return text;
  }

  return `${text
    .slice(0, 157)
    .trimEnd()}…`;
}

function toAbsoluteUrl(
  value: unknown,
): string | undefined {
  const url = toText(value);

  if (!url) {
    return undefined;
  }

  try {
    return new URL(
      url,
      SITE_URL,
    ).toString();
  } catch {
    return undefined;
  }
}

function externalUrl(
  value: unknown,
): string | undefined {
  const url = toText(value);

  if (!url) {
    return undefined;
  }

  try {
    return new URL(url).toString();
  } catch {
    return undefined;
  }
}