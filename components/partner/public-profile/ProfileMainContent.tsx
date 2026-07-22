import PartnerGallery from "@/components/partner/PartnerGallery";
import PartnerReviewForm from "@/components/partner/PartnerReviewForm";

import {
  ContentSection,
} from "./ProfileElements";
import ProfileReviews from "./ProfileReviews";

import type {
  PublicPartner,
  PublicPartnerReview,
} from "./types";

type ProfileMainContentProps = {
  partner: PublicPartner;
  galleryImages: string[];
  reviews: PublicPartnerReview[];
};

export default function ProfileMainContent({
  partner,
  galleryImages,
  reviews,
}: ProfileMainContentProps) {
  return (
    <div className="min-w-0 space-y-8">
      {partner.description && (
        <ContentSection
          title="Tietoa yrityksestä"
          icon="✨"
        >
          <p className="whitespace-pre-line text-base leading-8 text-[#62584f]">
            {partner.description}
          </p>
        </ContentSection>
      )}

      {galleryImages.length > 0 && (
        <ContentSection
          title="Kuvagalleria"
          icon="📷"
        >
          <PartnerGallery
            images={galleryImages}
            company={
              partner.company
            }
          />
        </ContentSection>
      )}

      {partner.opening_hours && (
        <ContentSection
          title="Aukioloajat"
          icon="🕒"
        >
          <p className="whitespace-pre-line leading-7 text-[#62584f]">
            {partner.opening_hours}
          </p>
        </ContentSection>
      )}

      {reviews.length > 0 && (
        <ContentSection
          title="Asiakkaiden arvostelut"
          icon="⭐"
        >
          <ProfileReviews
            reviews={reviews}
          />
        </ContentSection>
      )}

      <PartnerReviewForm
        partnerId={partner.id}
      />
    </div>
  );
}