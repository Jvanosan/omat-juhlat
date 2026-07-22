"use client";

import {
  useState,
  type FormEvent,
} from "react";

type PartnerReviewFormProps = {
  partnerId?: number | string;
};

type SubmitState = {
  loading: boolean;
  error: string;
  successMessage: string;
};

export default function PartnerReviewForm({
  partnerId,
}: PartnerReviewFormProps) {
  const [rating, setRating] =
    useState(5);

  const [customerName, setCustomerName] =
    useState("");

  const [
    customerEmail,
    setCustomerEmail,
  ] = useState("");

  const [title, setTitle] =
    useState("");

  const [review, setReview] =
    useState("");

  // Roskapostirobotit täyttävät usein tämän.
  const [website, setWebsite] =
    useState("");

  const [submitState, setSubmitState] =
    useState<SubmitState>({
      loading: false,
      error: "",
      successMessage: "",
    });

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (submitState.loading) {
      return;
    }

    const cleanName =
      customerName.trim();

    const cleanEmail =
      customerEmail
        .trim()
        .toLowerCase();

    const cleanTitle = title.trim();
    const cleanReview = review.trim();

    if (!partnerId) {
      setSubmitState({
        loading: false,
        error:
          "Palveluntarjoajan tunniste puuttuu.",
        successMessage: "",
      });

      return;
    }

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanReview
    ) {
      setSubmitState({
        loading: false,
        error:
          "Täytä nimi, sähköpostiosoite ja arvostelu.",
        successMessage: "",
      });

      return;
    }

    if (cleanReview.length < 10) {
      setSubmitState({
        loading: false,
        error:
          "Kirjoita vähintään 10 merkkiä pitkä arvostelu.",
        successMessage: "",
      });

      return;
    }

    try {
      setSubmitState({
        loading: true,
        error: "",
        successMessage: "",
      });

      const response = await fetch(
        "/api/partner-reviews",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            partnerId,
            customerName: cleanName,
            customerEmail: cleanEmail,
            title: cleanTitle,
            rating,
            review: cleanReview,
            website,
          }),
        },
      );

      const result = (await response
        .json()
        .catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Arvostelun lähettäminen epäonnistui.",
        );
      }

      setSubmitState({
        loading: false,
        error: "",
        successMessage:
          result.message ||
          "Kiitos arvostelusta! Arvostelu julkaistaan tarkistuksen jälkeen.",
      });

      setRating(5);
      setCustomerName("");
      setCustomerEmail("");
      setTitle("");
      setReview("");
      setWebsite("");
    } catch (error) {
      console.error(
        "REVIEW SUBMIT ERROR:",
        error,
      );

      setSubmitState({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Arvostelun lähettäminen epäonnistui.",
        successMessage: "",
      });
    }
  }

  if (submitState.successMessage) {
    return (
      <section
        role="status"
        className="rounded-3xl border border-[#b9dfd0] bg-[#edf8f3] p-6 text-center shadow-sm sm:p-8"
      >
        <div
          aria-hidden="true"
          className="text-4xl"
        >
          ✅
        </div>

        <h2 className="mt-4 text-2xl font-bold text-[#11634d]">
          Kiitos arvostelusta!
        </h2>

        <p className="mx-auto mt-2 max-w-lg leading-7 text-[#41685d]">
          {submitState.successMessage}
        </p>

        <p className="mt-3 text-sm text-[#5e7e74]">
          Admin tarkistaa arvostelun ennen
          julkaisua.
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-sm sm:p-7"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a773b]">
          Asiakaskokemus
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
          Jätä arvostelu
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#70675e]">
          Voit jättää arvostelun, jos olet
          valinnut tämän palveluntarjoajan
          OmatJuhlat-palvelun kautta.
        </p>
      </div>

      <div className="mt-6">
        <fieldset>
          <legend className="mb-3 text-sm font-bold text-[#51463d]">
            Arvosana
          </legend>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setRating(value)
                  }
                  aria-label={`${value} tähteä`}
                  aria-pressed={
                    rating === value
                  }
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition ${
                    value <= rating
                      ? "border-[#e5c36f] bg-[#fff8df] text-[#e0a321]"
                      : "border-[#ded3c4] bg-white text-[#c7beb5] hover:border-[#e5c36f]"
                  }`}
                >
                  ★
                </button>
              ),
            )}
          </div>

          <p className="mt-2 text-sm font-semibold text-[#795a28]">
            {rating === 5 &&
              "Erinomainen"}
            {rating === 4 &&
              "Erittäin hyvä"}
            {rating === 3 && "Hyvä"}
            {rating === 2 &&
              "Kohtalainen"}
            {rating === 1 && "Heikko"}
          </p>
        </fieldset>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="review-name"
            className="mb-2 block text-sm font-bold text-[#51463d]"
          >
            Nimi
          </label>

          <input
            id="review-name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            value={customerName}
            onChange={(event) =>
              setCustomerName(
                event.target.value,
              )
            }
            placeholder="Nimesi"
            className={fieldClassName}
          />
        </div>

        <div>
          <label
            htmlFor="review-email"
            className="mb-2 block text-sm font-bold text-[#51463d]"
          >
            Sähköpostiosoite
          </label>

          <input
            id="review-email"
            type="email"
            required
            autoComplete="email"
            value={customerEmail}
            onChange={(event) =>
              setCustomerEmail(
                event.target.value,
              )
            }
            placeholder="Sama osoite kuin tarjouspyynnössä"
            className={fieldClassName}
          />
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-[#91877d]">
        Sähköpostiosoitetta käytetään vain
        asiakkuuden tarkistamiseen. Sitä ei
        julkaista arvostelun yhteydessä.
      </p>

      <div className="mt-5">
        <label
          htmlFor="review-title"
          className="mb-2 block text-sm font-bold text-[#51463d]"
        >
          Arvostelun otsikko{" "}
          <span className="font-normal text-[#91877d]">
            (valinnainen)
          </span>
        </label>

        <input
          id="review-title"
          type="text"
          maxLength={120}
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Esimerkiksi: Loistava palvelu juhlapäivänä"
          className={fieldClassName}
        />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="review-comment"
            className="text-sm font-bold text-[#51463d]"
          >
            Arvostelu
          </label>

          <span className="text-xs font-medium text-[#91877d]">
            {1000 - review.length} merkkiä
            jäljellä
          </span>
        </div>

        <textarea
          id="review-comment"
          required
          minLength={10}
          maxLength={1000}
          rows={6}
          value={review}
          onChange={(event) =>
            setReview(event.target.value)
          }
          placeholder="Kerro kokemuksestasi palveluntarjoajan kanssa..."
          className={`${fieldClassName} min-h-40 resize-y`}
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="review-website">
          Verkkosivu
        </label>

        <input
          id="review-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) =>
            setWebsite(
              event.target.value,
            )
          }
        />
      </div>

      {submitState.error && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-4 text-sm font-semibold text-[#a33d3d]"
        >
          {submitState.error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitState.loading}
        className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f783a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {submitState.loading
          ? "Lähetetään..."
          : "Lähetä arvostelu"}
      </button>

      <p className="mt-4 text-xs leading-5 text-[#91877d]">
        Arvostelu julkaistaan vasta adminin
        tarkistuksen jälkeen.
      </p>
    </form>
  );
}

const fieldClassName =
  "min-h-14 w-full rounded-2xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3.5 text-[#211b16] outline-none transition placeholder:text-[#91877d] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35";