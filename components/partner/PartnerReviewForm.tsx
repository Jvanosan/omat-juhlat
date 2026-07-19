"use client";

import { FormEvent, useState } from "react";

type PartnerReviewFormProps = {
  partnerId?: number | string;
};

export default function PartnerReviewForm({
  partnerId,
}: PartnerReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !comment.trim()) {
      return;
    }

    console.log("Review submitted", {
      partnerId,
      rating,
      name: name.trim(),
      comment: comment.trim(),
    });

    setSubmitted(true);
    setName("");
    setComment("");
    setRating(5);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <p className="font-semibold text-emerald-300">
          Kiitos arvostelusta!
        </p>

        <p className="mt-2 text-sm text-zinc-400">
          Arvostelu odottaa vielä tallennuslogiikan yhdistämistä
          Supabaseen.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          Kirjoita uusi arvostelu
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">Jätä arvostelu</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Kerro kokemuksestasi tämän yrityksen kanssa.
        </p>
      </div>

      <div>
        <label
          htmlFor="review-rating"
          className="mb-2 block text-sm font-medium"
        >
          Arvosana
        </label>

        <select
          id="review-rating"
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
        >
          <option value={5}>5 – Erinomainen</option>
          <option value={4}>4 – Erittäin hyvä</option>
          <option value={3}>3 – Hyvä</option>
          <option value={2}>2 – Kohtalainen</option>
          <option value={1}>1 – Heikko</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="review-name"
          className="mb-2 block text-sm font-medium"
        >
          Nimi
        </label>

        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={80}
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
          placeholder="Nimesi"
        />
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-medium"
        >
          Arvostelu
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
          minLength={10}
          maxLength={1000}
          rows={5}
          className="w-full resize-y rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
          placeholder="Kerro kokemuksestasi..."
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
      >
        Lähetä arvostelu
      </button>
    </form>
  );
}