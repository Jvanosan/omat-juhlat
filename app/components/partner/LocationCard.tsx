type LocationInfo = {
  city: string;
  address: string;
  postal_code: string;
};

type LocationCardProps = {
  form: LocationInfo;
  onChange: (field: keyof LocationInfo, value: string) => void;
};

const cities = [
  "Helsinki",
  "Espoo",
  "Vantaa",
  "Kauniainen",
  "Tampere",
  "Turku",
  "Lahti",
  "Hämeenlinna",
  "Porvoo",
  "Muu paikkakunta",
];

export default function LocationCard({
  form,
  onChange,
}: LocationCardProps) {
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
          📍 Sijainti
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            color: "#6b7280",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Lisää yrityksesi tai palvelupisteesi sijaintitiedot.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        <div>
          <label style={labelStyle}>Kaupunki *</label>

          <select
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            style={inputStyle}
          >
            <option value="">Valitse kaupunki</option>

            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Katuosoite *</label>

          <input
            type="text"
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
            style={inputStyle}
            placeholder="Esim. Mannerheimintie 10"
          />
        </div>

        <div>
          <label style={labelStyle}>Postinumero *</label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={form.postal_code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5);
              onChange("postal_code", value);
            }}
            style={inputStyle}
            placeholder="00100"
          />

          <p
            style={{
              margin: "7px 0 0",
              color: "#6b7280",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Postinumerossa voi olla enintään viisi numeroa.
          </p>
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