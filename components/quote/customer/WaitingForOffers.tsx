"use client";

export default function WaitingForOffers({
  pendingRequestCount,
  onRefresh,
}: {
  pendingRequestCount: number;
  onRefresh: () => void;
}) {
  return (
    <section className="rounded-3xl border border-[#c7d9ed] bg-[#f1f7fd] p-6 text-center shadow-sm sm:p-9">
      <div
        aria-hidden="true"
        className="text-5xl"
      >
        📨
      </div>

      <h2 className="mt-5 text-2xl font-bold text-[#294e75]">
        Tarjouspyyntö lähetetty
      </h2>

      <p className="mx-auto mt-3 max-w-xl leading-7 text-[#526f8c]">
        {pendingRequestCount > 0
          ? pendingRequestCount === 1
            ? "Odotamme tarjousta yhdeltä palveluntarjoajalta."
            : `Odotamme tarjouksia ${pendingRequestCount} palveluntarjoajalta.`
          : "Tarjouksia ei ole vielä saapunut."}
      </p>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#70879d]">
        Voit palata tälle sivulle
        sähköpostissa olevasta
        henkilökohtaisesta linkistä.
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#9ebbd7] bg-white px-5 py-3 font-bold text-[#294e75] transition hover:-translate-y-0.5 hover:bg-[#f8fbff] hover:shadow-sm"
      >
        ↻ Tarkista uudet tarjoukset
      </button>
    </section>
  );
}