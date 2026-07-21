"use client";

type AdminSummaryProps = {
  totalPartners: number;
  openRequests: number;
  pendingApplications: number;
  pendingReviews: number;
  onNavigate: (sectionId: string) => void;
};

const cards = [
  {
    key: "partners",
    sectionId: "partners-section",
    label: "Kumppanit",
    icon: "🤝",
    color:
      "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    key: "requests",
    sectionId: "requests-section",
    label: "Avoimet tarjouspyynnöt",
    icon: "📨",
    color:
      "border-blue-200 bg-blue-50 text-blue-800",
  },
  {
    key: "applications",
    sectionId: "applications-section",
    label: "Odottavat hakemukset",
    icon: "📋",
    color:
      "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    key: "reviews",
    sectionId: "reviews-section",
    label: "Odottavat arvostelut",
    icon: "⭐",
    color:
      "border-violet-200 bg-violet-50 text-violet-800",
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
    applications: pendingApplications,
    reviews: pendingReviews,
  };

  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
          Yhteenveto
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Siirry osioon painamalla korttia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() =>
              onNavigate(card.sectionId)
            }
            className={`group rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${card.color}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-3xl font-bold">
                  {values[card.key]}
                </div>

                <div className="mt-2 text-sm font-semibold">
                  {card.label}
                </div>
              </div>

              <div
                aria-hidden="true"
                className="rounded-xl bg-white/70 p-3 text-2xl shadow-sm transition group-hover:scale-105"
              >
                {card.icon}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}