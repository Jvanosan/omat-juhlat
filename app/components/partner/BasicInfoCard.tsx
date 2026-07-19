type BasicInfo = {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
};

type BasicInfoCardProps = {
  form: BasicInfo;
  onChange: (field: keyof BasicInfo, value: string) => void;
};

export default function BasicInfoCard({
  form,
  onChange,
}: BasicInfoCardProps) {
  return (
    <section
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        marginBottom: 24,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
          fontSize: 24,
          fontWeight: 800,
          color: "#111827",
        }}
      >
        🏢 Yrityksen perustiedot
      </h2>

      <div
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        <div>
          <label style={labelStyle}>Yrityksen nimi *</label>
          <input
            value={form.company_name}
            onChange={(e) =>
              onChange("company_name", e.target.value)
            }
            style={inputStyle}
            placeholder="Esim. Juhlapalvelu Helsinki Oy"
          />
        </div>

        <div>
          <label style={labelStyle}>Yhteyshenkilö *</label>
          <input
            value={form.contact_name}
            onChange={(e) =>
              onChange("contact_name", e.target.value)
            }
            style={inputStyle}
            placeholder="Etu- ja sukunimi"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 18,
          }}
        >
          <div>
            <label style={labelStyle}>Sähköposti *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                onChange("email", e.target.value)
              }
              style={inputStyle}
              placeholder="yritys@example.fi"
            />
          </div>

          <div>
            <label style={labelStyle}>Puhelin *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                onChange("phone", e.target.value)
              }
              style={inputStyle}
              placeholder="+358..."
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Verkkosivut</label>
          <input
            value={form.website}
            onChange={(e) =>
              onChange("website", e.target.value)
            }
            style={inputStyle}
            placeholder="https://..."
          />
        </div>

        <div>
          <label style={labelStyle}>Yrityksen kuvaus *</label>

          <textarea
            rows={6}
            value={form.description}
            onChange={(e) =>
              onChange("description", e.target.value)
            }
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: 150,
            }}
            placeholder="Kerro yrityksestäsi, palveluistasi ja siitä, miksi asiakkaan kannattaa valita juuri teidät."
          />

          <div
            style={{
              textAlign: "right",
              color: "#6b7280",
              marginTop: 6,
              fontSize: 13,
            }}
          >
            {form.description.length} merkkiä
          </div>
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
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};