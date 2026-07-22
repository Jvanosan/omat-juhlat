import { formatReviewDate } from "./profileUtils";

import type { PublicPartnerReview } from "./types";

type ProfileReviewsProps = {
  reviews: PublicPartnerReview[];
};

export default function ProfileReviews({
  reviews,
}: ProfileReviewsProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const rating = Math.min(
          5,
          Math.max(
            1,
            Math.round(
              Number(review.rating),
            ),
          ),
        );

        const formattedDate =
          formatReviewDate(
            review.created_at,
          );

        return (
          <article
            key={review.id}
            className="rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className="text-[#e0a321]"
                aria-label={`${rating} tähteä viidestä`}
              >
                <span aria-hidden="true">
                  {"★".repeat(rating)}
                  {"☆".repeat(5 - rating)}
                </span>
              </span>

              {formattedDate && (
                <time
                  dateTime={
                    review.created_at
                  }
                  className="text-sm text-[#91877d]"
                >
                  {formattedDate}
                </time>
              )}
            </div>

            {review.review && (
              <p className="mt-3 whitespace-pre-line leading-7 text-[#62584f]">
                {review.review}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}