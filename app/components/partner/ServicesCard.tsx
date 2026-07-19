type ServicesInfo = {
  category: string;
  services: string;
  min_guests: string;
  max_guests: string;
  avg_price_level: string;
};

type ServicesCardProps = {
  form: ServicesInfo;
  onChange: (field: keyof ServicesInfo, value: string) => void;
};

const categories = [
  "Juhlatila",
  "Catering",
  "Valokuvaaja",
  "Koristelut",
  "Kuljetus",
  "DJ",
  "Bändi",
  "Ohjelmapalvelut",
  "Pitopalvelu",
  "Muu",
];

const priceRanges = [
  "Alle 500 €",
  "500–1000 €",
  "1000–2500 €",
  "2500–5000 €",
  "Yli 5000 €",
];

export default function ServicesCard({
  form,
  onChange,
}: ServicesCardProps) {
  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: 24,
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        marginBottom: 24,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          🎉 Palvelut
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            color: "#6b7280",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Kerro, mitä palveluita tarjoat ja minkä kokoisia tapahtumia pystyt
          palvelemaan.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        <div>
          <label style={labelStyle}>Palvelukategoria *</label>

          <select
            value={form.category}
            onChange={(e) =>
              onChange("category", e.target.value)
            }
            style={inputStyle}
          >
            <option value="">Valitse palvelu</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div>
  <label style={labelStyle}>Lisäpalvelut</label>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
      gap: 10,
      marginTop: 10,
    }}
  >
    {categories.map((service) => {
      const selected = form.services
        .split(",")
        .filter(Boolean);

      const checked = selected.includes(service);

      return (
        <label
          key={service}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              let next = [...selected];

              if (checked) {
                next = next.filter((x) => x !== service);
              } else {
                next.push(service);
              }

              onChange("services", next.join(","));
            }}
          />

          {service}
        </label>
      );
    })}
  </div>
</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 18,
          }}
        >
          <div>
            <label style={labelStyle}>Min. vieraita</label>

            <input
              type="number"
              min={1}
              value={form.min_guests}
              onChange={(e) =>
                onChange("min_guests", e.target.value)
              }
              style={inputStyle}
              placeholder="10"
            />
          </div>

          <div>
            <label style={labelStyle}>Max. vieraita</label>

            <input
              type="number"
              min={1}
              value={form.max_guests}
              onChange={(e) =>
                onChange("max_guests", e.target.value)
              }
              style={inputStyle}
              placeholder="200"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Hintataso</label>

          <select
            value={form.avg_price_level}
onChange={(e) =>
  onChange("avg_price_level", e.target.value)
}
            style={inputStyle}
          >
            <option value="">Valitse hintataso</option>

            {priceRanges.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 700,
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#111827",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};