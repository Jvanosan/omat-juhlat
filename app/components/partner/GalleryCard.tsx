type GalleryInfo = {
  logo_url: string;
  cover_image_url: string;
  gallery_urls: string;
};

type GalleryCardProps = {
  form: GalleryInfo;
  onChange: (field: keyof GalleryInfo, value: string) => void;
};

export default function GalleryCard({
  form,
  onChange,
}: GalleryCardProps) {
  const galleryImages = form.gallery_urls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

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
          🖼️ Yrityksen kuvat
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            color: "#6b7280",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Lisää tässä vaiheessa kuvien verkko-osoitteet. Varsinainen
          kuvien lataaminen voidaan yhdistää myöhemmin Supabase Storageen.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 20,
        }}
      >
        <div>
          <label style={labelStyle}>Logon URL</label>

          <input
            type="url"
            value={form.logo_url}
            onChange={(e) => onChange("logo_url", e.target.value)}
            style={inputStyle}
            placeholder="https://example.fi/logo.jpg"
          />

          {form.logo_url.trim() && (
            <div style={previewBoxStyle}>
              <p style={previewTitleStyle}>Logon esikatselu</p>

              <img
                src={form.logo_url}
                alt="Yrityksen logo"
                style={{
                  width: 110,
                  height: 110,
                  objectFit: "contain",
                  borderRadius: 14,
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>Kansikuvan URL</label>

          <input
            type="url"
            value={form.cover_image_url}
            onChange={(e) =>
              onChange("cover_image_url", e.target.value)
            }
            style={inputStyle}
            placeholder="https://example.fi/kansikuva.jpg"
          />

          {form.cover_image_url.trim() && (
            <div style={previewBoxStyle}>
              <p style={previewTitleStyle}>Kansikuvan esikatselu</p>

              <img
                src={form.cover_image_url}
                alt="Yrityksen kansikuva"
                style={{
                  width: "100%",
                  maxHeight: 280,
                  objectFit: "cover",
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>Gallerian kuvien URL-osoitteet</label>

          <textarea
            rows={5}
            value={form.gallery_urls}
            onChange={(e) =>
              onChange("gallery_urls", e.target.value)
            }
            style={{
              ...inputStyle,
              minHeight: 130,
              resize: "vertical",
            }}
            placeholder="https://example.fi/kuva1.jpg, https://example.fi/kuva2.jpg"
          />

          <p
            style={{
              margin: "7px 0 0",
              color: "#6b7280",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Erottele kuvien osoitteet pilkulla. Suositus on enintään 10 kuvaa.
          </p>

          {galleryImages.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
                marginTop: 16,
              }}
            >
              {galleryImages.slice(0, 10).map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`Gallerian kuva ${index + 1}`}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#f3f4f6",
                  }}
                />
              ))}
            </div>
          )}
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

const previewBoxStyle: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 14,
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
};

const previewTitleStyle: React.CSSProperties = {
  margin: "0 0 10px",
  color: "#4b5563",
  fontSize: 13,
  fontWeight: 700,
};