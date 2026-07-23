"use client";

type AdminSummaryProps = {
  totalPartners: number;
  openRequests: number;
  pendingApplications: number;
  pendingReviews: number;
  onNavigate: (
    sectionId: string,
  ) => void;
};

const cards = [
  {
    key: "partners",
    sectionId:
      "partners-section",
    label: "Kumppanit",
    description:
      "Kaikki palveluntarjoajat",
    icon: "🤝",
    color:
      "border-[#b9dfd0] bg-[#edf8f3]",
    numberColor:
      "text-[#11634d]",
    iconColor:
      "bg-white",
  },
  {
    key: "requests",
    sectionId:
      "requests-section",
    label: "Avoimet tarjouspyynnöt",
    description:
      "Odottaa käsittelyä",
    icon: "📨",
    color:
      "border-[#cdddf1] bg-[#f1f6fd]",
    numberColor:
      "text-[#284f87]",
    iconColor:
      "bg-white",
  },
  {
    key: "applications",
    sectionId:
      "applications-section",
    label: "Odottavat hakemukset",
    description:
      "Vaatii päätöksen",
    icon: "📋",
    color:
      "border-[#ead29d] bg-[#fff8e8]",
    numberColor:
      "text-[#87652f]",
    iconColor:
      "bg-white",
  },
  {
    key: "reviews",
    sectionId:
      "reviews-section",
    label: "Odottavat arvostelut",
    description:
      "Vaatii tarkistuksen",
    icon: "⭐",
    color:
      "border-[#dfccec] bg-[#faf3ff]",
    numberColor:
      "text-[#76508e]",
    iconColor:
      "bg-white",
  },
] as const;

export default function AdminSummary({
  totalPartners,
  openRequests,
  pendingApplications,
  pendingReviews,
  onNavigate,
}: AdminSummaryProps) {
  const values = {
    partners: totalPartners,
    requests: openRequests,
    applications:
      pendingApplications,
    reviews: pendingReviews,
  };

  return (
    <section className="mb-10">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
            Tilannekuva
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#211b16] sm:text-2xl">
            Yhteenveto
          </h2>
        </div>

        <p className="text-sm text-[#70675e]">
          Avaa osio painamalla korttia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const value =
            values[card.key];

          const requiresAction =
            (card.key ===
              "applications" ||
              card.key ===
                "reviews" ||
              card.key ===
                "requests") &&
            value > 0;

          return (
            <button
              key={card.key}
              type="button"
              onClick={() =>
                onNavigate(
                  card.sectionId,
                )
              }
              aria-label={`${card.label}: ${value}. Siirry osioon.`}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(73,53,31,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b48a45] focus-visible:ring-offset-2 ${card.color}`}
            >
              {requiresAction && (
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#c55454] shadow-[0_0_0_4px_rgba(197,84,84,0.12)]">
                  <span className="sr-only">
                    Vaatii toimintaa
                  </span>
                </span>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`text-3xl font-bold ${card.numberColor}`}
                  >
                    {value}
                  </div>

                  <div className="mt-2 font-bold text-[#3f362f]">
                    {card.label}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-[#70675e]">
                    {card.description}
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm transition group-hover:scale-105 ${card.iconColor}`}
                >
                  {card.icon}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#70675e]">
                Avaa osio

                <span
                  aria-hidden="true"
                  className="transition group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}