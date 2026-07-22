"use client";

type Partner = {
  id: string;
  company: string;
};

type SelectedPartnersBarProps = {
  partners: Partner[];
  selectedPartners: string[];
  onClear: () => void;
};

export default function SelectedPartnersBar({
  partners,
  selectedPartners,
  onClear,
}: SelectedPartnersBarProps) {
  if (selectedPartners.length === 0) {
    return null;
  }

  const selectedCompanies = partners.filter(
    (partner) =>
      selectedPartners.includes(
        String(partner.id),
      ),
  );

  function handleClear() {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa kaikki valitut palveluntarjoajat?",
    );

    if (confirmed) {
      onClear();
    }
  }

  function scrollToForm() {
    document
      .getElementById(
        "direct-request-form",
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <aside className="sticky top-24 z-30 mb-10 rounded-3xl border border-[#b9dfd0] bg-white/95 p-5 shadow-[0_18px_50px_rgba(73,53,31,0.14)] backdrop-blur sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#168365]">
            Omat valinnat
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#211b16]">
            {selectedPartners.length}{" "}
            {selectedPartners.length === 1
              ? "palveluntarjoaja valittu"
              : "palveluntarjoajaa valittu"}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#edcaca] bg-white px-4 py-2 text-sm font-bold text-[#a33d3d] transition hover:bg-[#fff0f0]"
          >
            Tyhjennä valinnat
          </button>

          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#168365] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#116b53]"
          >
            Jatka tarjouspyyntöön ↓
          </button>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {selectedCompanies.map((partner) => (
          <div
            key={partner.id}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#c7e4d9] bg-[#edf8f3] px-3 py-2 text-sm font-semibold text-[#11634d]"
          >
            <span aria-hidden="true">
              ✓
            </span>

            {partner.company}
          </div>
        ))}
      </div>
    </aside>
  );
}