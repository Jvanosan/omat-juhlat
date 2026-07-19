type BrowseFiltersProps = {
  areas: string[];
  services: string[];
  areaFilter: string;
  serviceFilter: string;
  onAreaChange: (value: string) => void;
  onServiceChange: (value: string) => void;
};

export default function BrowseFilters({
  areas,
  services,
  areaFilter,
  serviceFilter,
  onAreaChange,
  onServiceChange,
}: BrowseFiltersProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Alue
          </label>

          <select
            value={areaFilter}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:outline-none focus:border-emerald-600"
          >
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Palvelu
          </label>

          <select
            value={serviceFilter}
            onChange={(e) => onServiceChange(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:outline-none focus:border-emerald-600"
          >
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}