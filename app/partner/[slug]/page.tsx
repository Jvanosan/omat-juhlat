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

  return (
    <>
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