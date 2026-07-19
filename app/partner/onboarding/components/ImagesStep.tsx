"use client";

type ImagesStepProps = {
  logoUrl: string;
  coverImageUrl: string;
  galleryUrls: string[];
  onLogoChange: (value: string) => void;
  onCoverImageChange: (value: string) => void;
  onGalleryChange: (value: string[]) => void;
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

const imagePreviewStyle: React.CSSProperties = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid #e2ddd5",
  backgroundColor: "#f6f3ee",
};

export default function ImagesStep({
  logoUrl,
  coverImageUrl,
  galleryUrls,
  onLogoChange,
  onCoverImageChange,
  onGalleryChange,
}: ImagesStepProps) {
  const updateGalleryImage = (index: number, value: string) => {
    const updatedImages = [...galleryUrls];
    updatedImages[index] = value;
    onGalleryChange(updatedImages);
  };

  const addGalleryImage = () => {
    onGalleryChange([...galleryUrls, ""]);
  };

  const removeGalleryImage = (index: number) => {
    onGalleryChange(
      galleryUrls.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gap: 28,
      }}
    >
      <div>
        <h2
          style={{
            marginBottom: 6,
          }}
        >
          Yrityksen kuvat
        </h2>

        <p
          style={{
            color: "#666",
            marginTop: 0,
          }}
        >
          Lisää kuvat linkkeinä tässä vaiheessa. Varsinainen kuvien lataaminen
          Supabase Storageen lisätään myöhemmin.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <div>
          <label htmlFor="partner-logo" style={labelStyle}>
            Logon URL
          </label>

          <input
            id="partner-logo"
            type="url"
            style={inputStyle}
            placeholder="https://..."
            value={logoUrl}
            onChange={(event) => onLogoChange(event.target.value)}
          />
        </div>

        {logoUrl.trim() && (
          <div
            style={{
              maxWidth: 220,
            }}
          >
            <img
              src={logoUrl}
              alt="Yrityksen logon esikatselu"
              style={{
                ...imagePreviewStyle,
                height: 140,
                objectFit: "contain",
                padding: 12,
                boxSizing: "border-box",
              }}
            />
          </div>
        )}
      </section>

      <section
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <div>
          <label htmlFor="partner-cover-image" style={labelStyle}>
            Kansikuvan URL
          </label>

          <input
            id="partner-cover-image"
            type="url"
            style={inputStyle}
            placeholder="https://..."
            value={coverImageUrl}
            onChange={(event) => onCoverImageChange(event.target.value)}
          />
        </div>

        {coverImageUrl.trim() && (
          <img
            src={coverImageUrl}
            alt="Kansikuvan esikatselu"
            style={imagePreviewStyle}
          />
        )}
      </section>

      <section
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 6px",
            }}
          >
            Galleriakuvat
          </h3>

          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: 14,
            }}
          >
            Lisää esimerkiksi tilan, ruoan, koristelun tai aikaisempien
            tapahtumien kuvia.
          </p>
        </div>

        {galleryUrls.length === 0 && (
          <div
            style={{
              padding: 18,
              borderRadius: 12,
              border: "1px dashed #d2c9bc",
              backgroundColor: "#faf8f4",
              color: "#746d64",
              textAlign: "center",
            }}
          >
            Galleriakuvia ei ole vielä lisätty.
          </div>
        )}

        {galleryUrls.map((imageUrl, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gap: 10,
              padding: 16,
              border: "1px solid #e2ddd5",
              borderRadius: 12,
              backgroundColor: "#ffffff",
            }}
          >
            <label htmlFor={`gallery-image-${index}`} style={labelStyle}>
              Galleriakuva {index + 1}
            </label>

            <input
              id={`gallery-image-${index}`}
              type="url"
              style={inputStyle}
              placeholder="https://..."
              value={imageUrl}
              onChange={(event) =>
                updateGalleryImage(index, event.target.value)
              }
            />

            {imageUrl.trim() && (
              <img
                src={imageUrl}
                alt={`Galleriakuvan ${index + 1} esikatselu`}
                style={imagePreviewStyle}
              />
            )}

            <button
              type="button"
              onClick={() => removeGalleryImage(index)}
              style={{
                justifySelf: "start",
                padding: "9px 14px",
                borderRadius: 9,
                border: "1px solid #d8c4c4",
                backgroundColor: "#fffafa",
                color: "#8c3535",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Poista kuva
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addGalleryImage}
          style={{
            justifySelf: "start",
            padding: "11px 16px",
            borderRadius: 10,
            border: "1px solid #b8903e",
            backgroundColor: "#fff8e8",
            color: "#7d5d1b",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Lisää galleriakuva
        </button>
      </section>
    </div>
  );
}