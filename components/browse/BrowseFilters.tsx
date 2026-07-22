type BrowseFiltersProps = {
  areas: string[];
  services: string[];

  areaFilter: string;
  serviceFilter: string;
  eventDate: string;
  minDate: string;

  onAreaChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onEventDateChange: (value: string) => void;
};

const fieldClassName =
  "min-h-14 w-full rounded-2xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3.5 text-[#211b16] outline-none transition focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35";

export default function BrowseFilters({
  areas,
  services,
  areaFilter,
  serviceFilter,
  eventDate,
  minDate,
  onAreaChange,
  onServiceChange,
  onEventDateChange,
}: BrowseFiltersProps) {
  return (
    <section className="mb-8 rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-[0_14px_40px_rgba(73,53,31,0.07)] sm:p-7">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a773b]">
          Haku
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
          Rajaa sopivat palveluntarjoajat
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#70675e]">
          Valitse alue, palvelu ja tapahtuman päivämäärä.
          Näytämme samalla, ketkä ovat vapaana valitsemallasi
          päivällä.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="browse-area"
            className="mb-2 block text-sm font-bold text-[#51463d]"
          >
            📍 Alue
          </label>

          <select
            id="browse-area"
            value={areaFilter}
            onChange={(event) =>
              onAreaChange(event.target.value)
            }
            className={fieldClassName}
          >
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="browse-service"
            className="mb-2 block text-sm font-bold text-[#51463d]"
          >
            ✨ Palvelu
          </label>

          <select
            id="browse-service"
            value={serviceFilter}
            onChange={(event) =>
              onServiceChange(event.target.value)
            }
            className={fieldClassName}
          >
            {services.map((service) => (
              <option
                key={service}
                value={service}
              >
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="browse-event-date"
            className="mb-2 block text-sm font-bold text-[#51463d]"
          >
            📅 Tapahtuman päivämäärä
          </label>

          <input
            id="browse-event-date"
            type="date"
            required
            min={minDate}
            value={eventDate}
            onChange={(event) =>
              onEventDateChange(
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </div>
      </div>

      {!eventDate ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#ead29d] bg-[#fff8e8] p-4 text-sm text-[#795a28]">
          <span aria-hidden="true">
            💡
          </span>

          <p className="leading-6">
            Valitse tapahtuman päivämäärä nähdäksesi
            palveluntarjoajien saatavuuden.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-4 text-sm text-[#11634d]">
          <span aria-hidden="true">
            ✓
          </span>

          <p className="leading-6">
            Päivämäärä valittu. Tarkistamme
            palveluntarjoajien saatavuuden automaattisesti.
          </p>
        </div>
      )}
    </section>
  );
}