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
  if (selectedPartners.length === 0) return null;

  return (
    <div className="sticky top-4 z-20 mb-10 rounded-2xl border border-emerald-800 bg-zinc-900 p-5 shadow-lg">
      <h3 className="mb-3 text-xl font-semibold text-emerald-400">
        <button
          onClick={onClear}
          className="mb-3 rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        >
          Tyhjennä valinnat
        </button>

        📋 Valitsemasi palveluntarjoajat ({selectedPartners.length})
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {partners
          .filter((partner) => selectedPartners.includes(partner.id))
          .map((partner) => (
            <div
              key={partner.id}
              className="flex items-center gap-3 rounded-xl bg-zinc-800 p-3"
            >
              ✅ {partner.company}
            </div>
          ))}
      </div>
    </div>
  );
}