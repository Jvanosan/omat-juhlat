"use client";

import type { AdminReview } from "./types";

type ReviewsSectionProps = {
  pendingReviews: AdminReview[];
  approvedReviews: AdminReview[];
  processingId: string | null;
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
};

function getPartnerName(review: AdminReview) {
  if (Array.isArray(review.partners)) {
    return (
      review.partners[0]?.company ||
      review.partner_id
    );
  }

  return (
    review.partners?.company ||
    review.partner_id
  );
}

function RatingStars({
  rating,
}: {
  rating: number;
}) {
  const normalizedRating = Math.min(
    5,
    Math.max(1, Number(rating))
  );

  return (
    <span
      className="whitespace-nowrap text-amber-500"
      aria-label={`${normalizedRating} tähteä viidestä`}
    >
      {"★".repeat(normalizedRating)}
      <span className="text-slate-300">
        {"★".repeat(5 - normalizedRating)}
      </span>
    </span>
  );
}

export default function ReviewsSection({
  pendingReviews,
  approvedReviews,
  processingId,
  onApprove,
  onReject,
}: ReviewsSectionProps) {
  return (
    <section
      id="reviews-section"
      className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
          Arvostelut
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Arvostelujen hallinta
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Hyväksy asianmukaiset arvostelut tai poista
          sopimaton sisältö.
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Odottavat arvostelut
          <span className="ml-2 rounded-full bg-violet-100 px-2.5 py-1 text-xs text-violet-700">
            {pendingReviews.length}
          </span>
        </h3>

        {pendingReviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-slate-500">
            Ei odottavia arvosteluja.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-[950px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">
                    Yritys
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Asiakas
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Arvosana
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Arvostelu
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Päivä
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Toiminnot
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {pendingReviews.map((review) => {
                  const processing =
                    processingId === review.id;

                  return (
                    <tr
                      key={review.id}
                      className="align-top transition hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {getPartnerName(review)}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {review.customer_email || "–"}
                      </td>

                      <td className="px-4 py-4">
                        <RatingStars
                          rating={review.rating}
                        />
                      </td>

                      <td className="max-w-md whitespace-pre-line px-4 py-4 leading-6 text-slate-600">
                        {review.review || "–"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                        {new Date(
                          review.created_at
                        ).toLocaleDateString("fi-FI")}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                              onApprove(review.id)
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processing
                              ? "Tallennetaan..."
                              : "Hyväksy"}
                          </button>

                          <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                              onReject(review.id)
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processing
                              ? "Tallennetaan..."
                              : "Hylkää"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-slate-200 pt-8">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Hyväksytyt arvostelut
          <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700">
            {approvedReviews.length}
          </span>
        </h3>

        {approvedReviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-slate-500">
            Ei hyväksyttyjä arvosteluja.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-[800px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">
                    Yritys
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Asiakas
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Arvosana
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Arvostelu
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Päivä
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {approvedReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="align-top transition hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {getPartnerName(review)}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {review.customer_email || "–"}
                    </td>

                    <td className="px-4 py-4">
                      <RatingStars
                        rating={review.rating}
                      />
                    </td>

                    <td className="max-w-md whitespace-pre-line px-4 py-4 leading-6 text-slate-600">
                      {review.review || "–"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                      {new Date(
                        review.created_at
                      ).toLocaleDateString("fi-FI")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}