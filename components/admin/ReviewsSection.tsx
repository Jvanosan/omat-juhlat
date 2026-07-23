"use client";

import type {
  AdminReview,
} from "./types";

type ReviewsSectionProps = {
  pendingReviews: AdminReview[];
  approvedReviews: AdminReview[];
  processingId: string | null;

  onApprove: (
    reviewId: string,
  ) => void;

  onReject: (
    reviewId: string,
  ) => void;
};

export default function ReviewsSection({
  pendingReviews,
  approvedReviews,
  processingId,
  onApprove,
  onReject,
}: ReviewsSectionProps) {
  function approve(
    review: AdminReview,
  ) {
    const confirmed =
      window.confirm(
        "Hyväksytäänkö tämä arvostelu julkaistavaksi?",
      );

    if (confirmed) {
      onApprove(review.id);
    }
  }

  function reject(
    review: AdminReview,
  ) {
    const confirmed =
      window.confirm(
        "Hylätäänkö tämä arvostelu? Hylätty arvostelu poistetaan käsittelyjonosta.",
      );

    if (confirmed) {
      onReject(review.id);
    }
  }

  return (
    <section
      id="reviews-section"
      className="scroll-mt-6 overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
            Arvostelut
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
            Arvostelujen hallinta
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#70675e]">
            Julkaise asialliset
            arvostelut ja hylkää
            sopimaton sisältö.
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${
            pendingReviews.length > 0
              ? "border-[#ead29d] bg-[#fff8e8] text-[#795a28]"
              : "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]"
          }`}
        >
          {pendingReviews.length > 0
            ? `${pendingReviews.length} odottaa tarkistusta`
            : "Ei tarkistettavia"}
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <section
          aria-labelledby="pending-reviews-title"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3
              id="pending-reviews-title"
              className="text-lg font-bold text-[#211b16]"
            >
              Odottavat arvostelut
            </h3>

            <CountBadge
              count={
                pendingReviews.length
              }
              variant="pending"
            />
          </div>

          {pendingReviews.length ===
          0 ? (
            <EmptyReviews
              icon="✅"
              title="Kaikki arvostelut on käsitelty"
              description="Uudet tarkistettavat arvostelut näkyvät tässä."
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {pendingReviews.map(
                (review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    pending
                    processing={
                      processingId ===
                      review.id
                    }
                    onApprove={() =>
                      approve(review)
                    }
                    onReject={() =>
                      reject(review)
                    }
                  />
                ),
              )}
            </div>
          )}
        </section>

        <details className="group mt-8 border-t border-[#eee5d9] pt-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl border border-[#e8ded0] bg-[#fffaf2] px-5 py-4 transition hover:border-[#d8c7ad]">
            <div>
              <h3 className="font-bold text-[#211b16]">
                Hyväksytyt
                arvostelut
              </h3>

              <p className="mt-1 text-xs text-[#91877d]">
                Avaa julkaistujen
                arvostelujen tarkistamista
                varten.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CountBadge
                count={
                  approvedReviews.length
                }
                variant="approved"
              />

              <span
                aria-hidden="true"
                className="text-[#87652f] transition group-open:rotate-180"
              >
                ▾
              </span>
            </div>
          </summary>

          <div className="pt-5">
            {approvedReviews.length ===
            0 ? (
              <EmptyReviews
                icon="⭐"
                title="Ei hyväksyttyjä arvosteluja"
                description="Julkaistut arvostelut näkyvät tässä."
              />
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {approvedReviews.map(
                  (review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </details>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  pending = false,
  processing = false,
  onApprove,
  onReject,
}: {
  review: AdminReview;
  pending?: boolean;
  processing?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const partnerName =
    getPartnerName(review);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
            Palveluntarjoaja
          </p>

          <h4 className="mt-1 text-lg font-bold text-[#211b16]">
            {partnerName}
          </h4>
        </div>

        <RatingStars
          rating={review.rating}
        />
      </div>

      <blockquote className="mt-5 flex-1 rounded-2xl border border-[#eee5d9] bg-white p-4">
        <p className="whitespace-pre-line text-sm leading-7 text-[#62584f]">
          {review.review?.trim() ||
            "Arvostelussa ei ole kirjallista kommenttia."}
        </p>
      </blockquote>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <ReviewDetail
          label="Asiakas"
          value={
            review.customer_email ||
            "Ei ilmoitettu"
          }
          email={Boolean(
            review.customer_email,
          )}
        />

        <ReviewDetail
          label="Lähetetty"
          value={formatDate(
            review.created_at,
          )}
        />
      </dl>

      {pending && (
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#eee5d9] pt-5">
          <button
            type="button"
            disabled={processing}
            onClick={onApprove}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#168365] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing
              ? "Tallennetaan..."
              : "Hyväksy"}
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={onReject}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#edcaca] bg-[#fff4f4] px-4 py-3 text-sm font-bold text-[#a33d3d] transition hover:bg-[#ffeaea] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing
              ? "Tallennetaan..."
              : "Hylkää"}
          </button>
        </div>
      )}
    </article>
  );
}

function RatingStars({
  rating,
}: {
  rating: number;
}) {
  const normalizedRating =
    Math.min(
      5,
      Math.max(
        1,
        Math.round(
          Number(rating),
        ),
      ),
    );

  return (
    <div
      className="flex items-center gap-2 rounded-full border border-[#ead29d] bg-[#fff8e8] px-3 py-1.5"
      aria-label={`${normalizedRating} tähteä viidestä`}
    >
      <span
        aria-hidden="true"
        className="whitespace-nowrap text-sm tracking-tight text-[#d19b2f]"
      >
        {"★".repeat(
          normalizedRating,
        )}

        <span className="text-[#ddd2bf]">
          {"★".repeat(
            5 -
              normalizedRating,
          )}
        </span>
      </span>

      <span className="text-xs font-bold text-[#795a28]">
        {normalizedRating}/5
      </span>
    </div>
  );
}

function ReviewDetail({
  label,
  value,
  email = false,
}: {
  label: string;
  value: string;
  email?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#eee5d9] bg-white p-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
        {label}
      </dt>

      <dd className="mt-1 break-all text-sm font-semibold text-[#3f362f]">
        {email &&
        value !==
          "Ei ilmoitettu" ? (
          <a
            href={`mailto:${value}`}
            className="text-[#87652f] transition hover:text-[#5f451f]"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function CountBadge({
  count,
  variant,
}: {
  count: number;
  variant:
    | "pending"
    | "approved";
}) {
  return (
    <span
      className={`inline-flex min-w-8 items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${
        variant === "pending"
          ? "bg-[#fff1d2] text-[#795a28]"
          : "bg-[#edf8f3] text-[#11634d]"
      }`}
    >
      {count}
    </span>
  );
}

function EmptyReviews({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8c7ad] bg-[#fffdf9] px-5 py-9 text-center">
      <div className="text-4xl">
        {icon}
      </div>

      <p className="mt-4 font-bold text-[#3f362f]">
        {title}
      </p>

      <p className="mt-1 text-sm text-[#91877d]">
        {description}
      </p>
    </div>
  );
}

function getPartnerName(
  review: AdminReview,
) {
  if (
    Array.isArray(
      review.partners,
    )
  ) {
    return (
      review.partners[0]
        ?.company ||
      "Tuntematon yritys"
    );
  }

  return (
    review.partners?.company ||
    "Tuntematon yritys"
  );
}

function formatDate(
  value: string,
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Ei ilmoitettu";
  }

  return new Intl.DateTimeFormat(
    "fi-FI",
  ).format(date);
}