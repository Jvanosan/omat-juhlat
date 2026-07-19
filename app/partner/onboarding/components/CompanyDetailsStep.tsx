"use client";

type CompanyDetails = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  description: string;
};

type Props = {
  form: CompanyDetails;
  onChange: (field: keyof CompanyDetails, value: string) => void;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d7d7d7",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
};

export default function CompanyDetailsStep({
  form,
  onChange,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gap: 20,
      }}
    >
      <div>
        <h2
          style={{
            marginBottom: 6,
          }}
        >
          Yrityksen tiedot
        </h2>

        <p
          style={{
            color: "#666",
            marginTop: 0,
          }}
        >
          Aloitetaan yrityksen perustiedoista.
        </p>
      </div>

      <div>
        <label style={labelStyle}>
          Yrityksen nimi
        </label>

        <input
          style={inputStyle}
          value={form.companyName}
          onChange={(e) =>
            onChange("companyName", e.target.value)
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Yhteyshenkilö
        </label>

        <input
          style={inputStyle}
          value={form.contactName}
          onChange={(e) =>
            onChange("contactName", e.target.value)
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Sähköposti
        </label>

        <input
          type="email"
          style={inputStyle}
          value={form.email}
          onChange={(e) =>
            onChange("email", e.target.value)
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Puhelin
        </label>

        <input
          style={inputStyle}
          value={form.phone}
          onChange={(e) =>
            onChange("phone", e.target.value)
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Nettisivu
        </label>

        <input
          style={inputStyle}
          placeholder="https://..."
          value={form.website}
          onChange={(e) =>
            onChange("website", e.target.value)
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Kaupunki
        </label>

        <input
          style={inputStyle}
          value={form.city}
          onChange={(e) =>
            onChange("city", e.target.value)
          }
        />
      </div>

      <div>
        <label style={labelStyle}>
          Yrityksen kuvaus
        </label>

        <textarea
          rows={6}
          style={{
            ...inputStyle,
            resize: "vertical",
          }}
          value={form.description}
          onChange={(e) =>
            onChange("description", e.target.value)
          }
        />
      </div>
    </div>
  );
}