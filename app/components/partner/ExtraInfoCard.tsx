type ExtraInfo = {
  parking: boolean;
  accessibility: boolean;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  opening_hours: string;
  additional_info: string;
};

type ExtraInfoCardProps = {
  form: ExtraInfo;
  onChange: (
    field: keyof ExtraInfo,
    value: string | boolean
  ) => void;
};

export default function ExtraInfoCard({
  form,
  onChange,
}: ExtraInfoCardProps) {
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
          ℹ️ Lisätiedot
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            color: "#6b7280",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Lisää asiakkaalle hyödyllisiä tietoja yrityksestäsi,
          saavutettavuudesta ja yhteydenottokanavista.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 22,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <label style={optionCardStyle}>
            <input
              type="checkbox"
              checked={form.parking}
              onChange={(e) =>
                onChange("parking", e.target.checked)
              }
              style={checkboxStyle}
            />

            <div>
              <div style={optionTitleStyle}>
                🚗 Pysäköinti saatavilla
              </div>

              <div style={optionDescriptionStyle}>
                Asiakkailla on mahdollisuus pysäköidä
                tapahtumapaikan läheisyydessä.
              </div>
            </div>
          </label>

          <label style={optionCardStyle}>
            <input
              type="checkbox"
              checked={form.accessibility}
              onChange={(e) =>
                onChange("accessibility", e.target.checked)
              }
              style={checkboxStyle}
            />

            <div>
              <div style={optionTitleStyle}>
                ♿ Esteetön pääsy
              </div>

              <div style={optionDescriptionStyle}>
                Tilaan tai palveluun pääsee myös
                liikuntarajoitteisena.
              </div>
            </div>
          </label>
        </div>

        <div>
          <h3
            style={{
              margin: "0 0 14px",
              color: "#111827",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            Sosiaalinen media
          </h3>

          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Instagram</label>

              <input
                type="url"
                value={form.instagram_url}
                onChange={(e) =>
                  onChange("instagram_url", e.target.value)
                }
                style={inputStyle}
                placeholder="https://instagram.com/yritys"
              />
            </div>

            <div>
              <label style={labelStyle}>Facebook</label>

              <input
                type="url"
                value={form.facebook_url}
                onChange={(e) =>
                  onChange("facebook_url", e.target.value)
                }
                style={inputStyle}
                placeholder="https://facebook.com/yritys"
              />
            </div>

            <div>
              <label style={labelStyle}>TikTok</label>

              <input
                type="url"
                value={form.tiktok_url}
                onChange={(e) =>
                  onChange("tiktok_url", e.target.value)
                }
                style={inputStyle}
                placeholder="https://tiktok.com/@yritys"
              />
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Aukioloajat</label>

          <textarea
            rows={4}
            value={form.opening_hours}
            onChange={(e) =>
              onChange("opening_hours", e.target.value)
            }
            style={{
              ...inputStyle,
              minHeight: 110,
              resize: "vertical",
            }}
            placeholder={`Esim.
Ma–Pe 9.00–18.00
La 10.00–16.00
Su sopimuksen mukaan`}
          />
        </div>

        <div>
          <label style={labelStyle}>Muut lisätiedot</label>

          <textarea
            rows={5}
            value={form.additional_info}
            onChange={(e) =>
              onChange("additional_info", e.target.value)
            }
            style={{
              ...inputStyle,
              minHeight: 130,
              resize: "vertical",
            }}
            placeholder="Kerro esimerkiksi varustelusta, toimitusalueesta, erityisruokavalioista tai muista asiakkaalle tärkeistä tiedoista."
          />

          <div
            style={{
              marginTop: 7,
              textAlign: "right",
              color: "#6b7280",
              fontSize: 13,
            }}
          >
            {form.additional_info.length} merkkiä
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
  background: "#ffffff",
  color: "#111827",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

const optionCardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: 16,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  cursor: "pointer",
};

const checkboxStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  marginTop: 2,
  cursor: "pointer",
};

const optionTitleStyle: React.CSSProperties = {
  color: "#111827",
  fontSize: 15,
  fontWeight: 800,
};

const optionDescriptionStyle: React.CSSProperties = {
  marginTop: 5,
  color: "#6b7280",
  fontSize: 13,
  lineHeight: 1.5,
};