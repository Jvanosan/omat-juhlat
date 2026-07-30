"use client";

import {
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import { supabase } from "@/lib/supabase";

type ImagesStepProps = {
  logoUrl: string;
  coverImageUrl: string;
  galleryUrls: string[];
  onLogoChange: (value: string) => void;
  onCoverChange: (value: string) => void;
  onGalleryChange: (value: string[]) => void;
};

type UploadTarget = "logo" | "cover" | "gallery";

const BUCKET_NAME = "partner-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 8;

const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
};

const imagePreviewStyle: CSSProperties = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid #e2ddd5",
  backgroundColor: "#f6f3ee",
};

const uploadButtonStyle: CSSProperties = {
  display: "inline-block",
  padding: "11px 16px",
  borderRadius: 10,
  border: "1px solid #b8903e",
  backgroundColor: "#fff8e8",
  color: "#7d5d1b",
  fontWeight: 700,
  cursor: "pointer",
};

const removeButtonStyle: CSSProperties = {
  padding: "9px 14px",
  borderRadius: 9,
  border: "1px solid #d8c4c4",
  backgroundColor: "#fffafa",
  color: "#8c3535",
  fontWeight: 600,
  cursor: "pointer",
};

function getFileExtension(file: File) {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensions[file.type];
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Kuvan lataaminen epäonnistui. Yritä uudelleen.";
}

export default function ImagesStep({
  logoUrl,
  coverImageUrl,
  galleryUrls,
  onLogoChange,
  onCoverChange,
  onGalleryChange,
}: ImagesStepProps) {
  const [uploadingTarget, setUploadingTarget] =
    useState<UploadTarget | null>(null);
  const [uploadError, setUploadError] = useState("");

  const hasGalleryImages = galleryUrls.some(
    (imageUrl) => imageUrl.trim().length > 0
  );
  const galleryImageCount = galleryUrls.filter(
  (imageUrl) => imageUrl.trim().length > 0
).length;

const remainingGallerySlots = Math.max(
  0,
  MAX_GALLERY_IMAGES - galleryImageCount
);

  const uploadImage = async (
    file: File,
    imageType: UploadTarget
  ) => {
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      throw new Error(
        "Valitse JPG-, PNG- tai WebP-muotoinen kuva."
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        "Kuva on liian suuri. Suurin sallittu koko on 5 MB."
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error(
        "Kirjautumistietoja ei löytynyt. Kirjaudu uudelleen."
      );
    }

    const extension = getFileExtension(file);
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `${user.id}/${imageType}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("IMAGE UPLOAD ERROR:", uploadError);
      throw new Error(
        "Kuvan lataaminen epäonnistui. Yritä uudelleen."
      );
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSingleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    imageType: "logo" | "cover",
    onChange: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadError("");
    setUploadingTarget(imageType);

    try {
      const publicUrl = await uploadImage(file, imageType);
      onChange(publicUrl);
    } catch (error) {
      setUploadError(getErrorMessage(error));
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleGalleryUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
  return;
}

if (remainingGallerySlots === 0) {
  setUploadError(
    `Galleriassa voi olla enintään ${MAX_GALLERY_IMAGES} kuvaa.`
  );
  return;
}

if (files.length > remainingGallerySlots) {
  setUploadError(
    `Voit lisätä vielä enintään ${remainingGallerySlots} kuvaa.`
  );
  return;
}

setUploadError("");
setUploadingTarget("gallery");

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const publicUrl = await uploadImage(file, "gallery");
        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      setUploadError(getErrorMessage(error));
    } finally {
      if (uploadedUrls.length > 0) {
        onGalleryChange([...galleryUrls, ...uploadedUrls]);
      }

      setUploadingTarget(null);
    }
  };

  const removeGalleryImage = (index: number) => {
    onGalleryChange(
      galleryUrls.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  const uploadInProgress = uploadingTarget !== null;
  const galleryUploadDisabled =
  uploadInProgress || remainingGallerySlots === 0;

  return (
    <div
      style={{
        display: "grid",
        gap: 28,
      }}
    >
      <div>
        <h2 style={{ marginBottom: 6 }}>
          Yrityksen kuvat
        </h2>

        <p
          style={{
            color: "#666",
            marginTop: 0,
            lineHeight: 1.6,
          }}
        >
          Lisää kuvat suoraan puhelimeltasi tai
          tietokoneeltasi. Laadukkaat kuvat auttavat
          asiakasta tutustumaan palveluihisi.
        </p>
      </div>

      <div
        role="note"
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid #ead29d",
          backgroundColor: "#fff8e8",
          color: "#795a28",
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 700,
          }}
        >
          Pakollinen kuva
          <span
            aria-hidden="true"
            style={{
              marginLeft: 4,
              color: "#a33d3d",
            }}
          >
            *
          </span>
        </p>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Lisää kansikuva tai vähintään yksi
          galleriakuva. Logo on valinnainen.
        </p>
      </div>

      {uploadError && (
        <div
          role="alert"
          style={{
            padding: 14,
            borderRadius: 10,
            border: "1px solid #e1b5b5",
            backgroundColor: "#fff4f4",
            color: "#8c3535",
            fontWeight: 600,
          }}
        >
          {uploadError}
        </div>
      )}

      <section
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <div>
          <span style={labelStyle}>
            Logo (valinnainen)
          </span>

          <input
            id="partner-logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploadInProgress}
            onChange={(event) =>
              handleSingleImageUpload(
                event,
                "logo",
                onLogoChange
              )
            }
            hidden
          />

          <label
            htmlFor="partner-logo"
            aria-disabled={uploadInProgress}
            style={{
              ...uploadButtonStyle,
              opacity: uploadInProgress ? 0.6 : 1,
              cursor: uploadInProgress
                ? "not-allowed"
                : "pointer",
            }}
          >
            {uploadingTarget === "logo"
              ? "Ladataan logoa..."
              : logoUrl.trim()
                ? "Vaihda logo"
                : "Valitse logo"}
          </label>
        </div>

        {logoUrl.trim() && (
          <div
            style={{
              display: "grid",
              gap: 10,
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

            <button
              type="button"
              onClick={() => onLogoChange("")}
              style={{
                ...removeButtonStyle,
                justifySelf: "start",
              }}
            >
              Poista logo
            </button>
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
          <span style={labelStyle}>
            Kansikuva
            <span
              style={{
                marginLeft: 6,
                color: "#70675e",
                fontWeight: 400,
              }}
            >
              (vaihtoehto 1)
            </span>
          </span>

          <input
            id="partner-cover-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploadInProgress}
            onChange={(event) =>
              handleSingleImageUpload(
                event,
                "cover",
                onCoverChange
              )
            }
            hidden
          />

          <label
            htmlFor="partner-cover-image"
            aria-disabled={uploadInProgress}
            style={{
              ...uploadButtonStyle,
              opacity: uploadInProgress ? 0.6 : 1,
              cursor: uploadInProgress
                ? "not-allowed"
                : "pointer",
            }}
          >
            {uploadingTarget === "cover"
              ? "Ladataan kansikuvaa..."
              : coverImageUrl.trim()
                ? "Vaihda kansikuva"
                : "Valitse kansikuva"}
          </label>
        </div>

        {coverImageUrl.trim() && (
          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <img
              src={coverImageUrl}
              alt="Kansikuvan esikatselu"
              style={imagePreviewStyle}
            />

            <button
              type="button"
              onClick={() => onCoverChange("")}
              style={{
                ...removeButtonStyle,
                justifySelf: "start",
              }}
            >
              Poista kansikuva
            </button>
          </div>
        )}
      </section>

      <section
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 6px" }}>
            Galleriakuvat
            <span
              style={{
                marginLeft: 6,
                color: "#70675e",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              (vaihtoehto 2)
            </span>
          </h3>

          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Voit valita yhden tai useita kuvia
            samalla kertaa.
          </p>
        </div>

        {!hasGalleryImages && (
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

        {galleryUrls.map((imageUrl, index) => {
          if (!imageUrl.trim()) {
            return null;
          }

          return (
            <div
              key={`${imageUrl}-${index}`}
              style={{
                display: "grid",
                gap: 10,
                padding: 16,
                border: "1px solid #e2ddd5",
                borderRadius: 12,
                backgroundColor: "#ffffff",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                Galleriakuva {index + 1}
              </p>

              <img
                src={imageUrl}
                alt={`Galleriakuvan ${index + 1} esikatselu`}
                style={imagePreviewStyle}
              />

              <button
                type="button"
                onClick={() =>
                  removeGalleryImage(index)
                }
                style={{
                  ...removeButtonStyle,
                  justifySelf: "start",
                }}
              >
                Poista kuva
              </button>
            </div>
          );
        })}

        <input
          id="partner-gallery-images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={galleryUploadDisabled}
          onChange={handleGalleryUpload}
          hidden
        />

        <label
          htmlFor="partner-gallery-images"
          aria-disabled={galleryUploadDisabled}
          style={{
            ...uploadButtonStyle,
            justifySelf: "start",
            opacity: galleryUploadDisabled ? 0.6 : 1,
cursor: galleryUploadDisabled
  ? "not-allowed"
  : "pointer",
          }}
        >
          {uploadingTarget === "gallery"
  ? "Ladataan galleriakuvia..."
  : remainingGallerySlots === 0
    ? "Galleriakuvien enimmäismäärä täynnä"
    : "+ Valitse galleriakuvia"}
        </label>

        <p
  style={{
    margin: 0,
    color: "#746d64",
    fontSize: 13,
  }}
>
  Galleriakuvat: {galleryImageCount} /{" "}
  {MAX_GALLERY_IMAGES}. Sallitut muodot: JPG, PNG
  ja WebP. Enintään 5 MB per kuva.
</p>
      </section>
    </div>
  );
}