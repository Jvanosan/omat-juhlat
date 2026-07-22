import {
  REQUEST_FILTERS,
  type RequestFilter,
} from "./requestFilters";

type RequestFilterTabsProps = {
  activeFilter: RequestFilter;
  counts: Record<
    RequestFilter,
    number
  >;
  onChange: (
    filter: RequestFilter,
  ) => void;
};

export default function RequestFilterTabs({
  activeFilter,
  counts,
  onChange,
}: RequestFilterTabsProps) {
  return (
    <section
      aria-labelledby="request-filter-title"
      className="rounded-3xl border border-[#e8ded0] bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4">
        <h2
          id="request-filter-title"
          className="font-bold text-[#211b16]"
        >
          Näytä tarjouspyynnöt
        </h2>

        <p className="mt-1 text-sm text-[#70675e]">
          Aloita pyynnöistä, jotka
          odottavat vastaustasi.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Tarjouspyyntöjen suodatus"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {REQUEST_FILTERS.map(
          (filter) => {
            const active =
              activeFilter === filter.id;

            const count =
              counts[filter.id];

            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() =>
                  onChange(filter.id)
                }
                className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? filter.id ===
                      "action"
                      ? "border-[#d4a449] bg-[#fff4db] text-[#795a28] shadow-sm"
                      : "border-[#b48a45] bg-[#b48a45] text-white shadow-sm"
                    : "border-[#e8ded0] bg-[#fffdf9] text-[#62584f] hover:border-[#d8c7ad] hover:bg-white hover:text-[#211b16]"
                }`}
              >
                <span aria-hidden="true">
                  {filter.icon}
                </span>

                <span>
                  {filter.label}
                </span>

                <span
                  className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs ${
                    active
                      ? filter.id ===
                        "action"
                        ? "bg-white text-[#795a28]"
                        : "bg-white/20 text-white"
                      : count > 0 &&
                          filter.id ===
                            "action"
                        ? "bg-[#fff0c7] text-[#795a28]"
                        : "bg-[#f0ebe5] text-[#70675e]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          },
        )}
      </div>
    </section>
  );
}