"use client";

import type {
  OfferSortOption,
} from "./types";

export default function OfferSort({
  value,
  onChange,
}: {
  value: OfferSortOption;
  onChange: (
    value: OfferSortOption,
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e8ded0] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <label
          htmlFor="offer-sort"
          className="font-bold text-[#3f362f]"
        >
          Järjestä tarjoukset
        </label>

        <p className="mt-1 text-sm text-[#91877d]">
          Valitse sinulle tärkein
          vertailuperuste.
        </p>
      </div>

      <select
        id="offer-sort"
        value={value}
        onChange={(event) =>
          onChange(
            event.target
              .value as OfferSortOption,
          )
        }
        className="min-h-12 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 font-semibold text-[#211b16] outline-none transition focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35 sm:w-auto sm:min-w-52"
      >
        <option value="price">
          Halvin ensin
        </option>

        <option value="rating">
          Paras arvosana
        </option>

        <option value="newest">
          Uusin ensin
        </option>
      </select>
    </div>
  );
}