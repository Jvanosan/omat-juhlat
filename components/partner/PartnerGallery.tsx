"use client";

import {
  useEffect,
  useState,
} from "react";

type PartnerGalleryProps = {
  images?: string[] | string | null;
  company?: string;
};

function normalizeImages(
  images: PartnerGalleryProps["images"],
) {
  if (!images) {
    return [];
  }

  const normalized = Array.isArray(images)
    ? images
    : images.split(",");

  return Array.from(
    new Set(
      normalized
        .map((image) => image.trim())
        .filter(Boolean),
    ),
  );
}

export default function PartnerGallery({
  images,
  company = "Partneriyritys",
}: PartnerGalleryProps) {
  const imageList = normalizeImages(images);

  const [
    selectedImageIndex,
    setSelectedImageIndex,
  ] = useState<number | null>(null);

  const modalOpen =
    selectedImageIndex !== null;

  useEffect(() => {
    if (!modalOpen) return;

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setSelectedImageIndex(null);
      }

      if (
        event.key === "ArrowRight"
      ) {
        setSelectedImageIndex(
          (current) => {
            if (current === null) {
              return null;
            }

            return (
              (current + 1) %
              imageList.length
            );
          },
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedImageIndex(
          (current) => {
            if (current === null) {
              return null;
            }

            return (
              (current -
                1 +
                imageList.length) %
              imageList.length
            );
          },
        );
      }
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [modalOpen, imageList.length]);

  function showPreviousImage() {
    setSelectedImageIndex(
      (current) => {
        if (current === null) {
          return null;
        }

        return (
          (current -
            1 +
            imageList.length) %
          imageList.length
        );
      },
    );
  }

  function showNextImage() {
    setSelectedImageIndex(
      (current) => {
        if (current === null) {
          return null;
        }

        return (
          (current + 1) %
          imageList.length
        );
      },
    );
  }

  if (imageList.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-[#d8c7ad] bg-gradient-to-br from-[#fffaf2] to-[#f7ecee] px-6 text-center">
        <div>
          <div
            aria-hidden="true"
            className="text-5xl"
          >
            🖼️
          </div>

          <p className="mt-4 font-bold text-[#51463d]">
            Kuvia ei ole vielä lisätty
          </p>

          <p className="mt-1 text-sm text-[#91877d]">
            Yrityksen kuvat tulevat
            näkyviin tähän.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {imageList.map(
          (image, index) => {
            const featured =
              index === 0 &&
              imageList.length > 2;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() =>
                  setSelectedImageIndex(
                    index,
                  )
                }
                aria-label={`Avaa ${company}, kuva ${
                  index + 1
                } suurempana`}
                className={`group relative overflow-hidden rounded-2xl border border-[#e8ded0] bg-[#f4eee5] text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d1ba96] hover:shadow-md ${
                  featured
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <img
                  src={image}
                  alt={`${company}, kuva ${
                    index + 1
                  }`}
                  className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                    featured
                      ? "h-72 sm:h-96"
                      : "h-56 sm:h-64"
                  }`}
                  loading={
                    index === 0
                      ? "eager"
                      : "lazy"
                  }
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#211b16]/35 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />

                <span className="absolute bottom-3 right-3 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold text-[#51463d] shadow-sm backdrop-blur">
                  🔍 Avaa kuva
                </span>
              </button>
            );
          },
        )}
      </div>

      {selectedImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${company} kuvagalleria`}
          onClick={() =>
            setSelectedImageIndex(null)
          }
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211b16]/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={() =>
              setSelectedImageIndex(null)
            }
            aria-label="Sulje kuvagalleria"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-2xl text-white transition hover:bg-white/25 sm:right-7 sm:top-7"
          >
            ✕
          </button>

          {imageList.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              aria-label="Edellinen kuva"
              className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-2xl text-white transition hover:bg-white/25 sm:left-7"
            >
              ‹
            </button>
          )}

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="relative max-h-full max-w-6xl"
          >
            <img
              src={
                imageList[
                  selectedImageIndex
                ]
              }
              alt={`${company}, kuva ${
                selectedImageIndex + 1
              }`}
              className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <div className="mt-3 text-center text-sm font-medium text-white">
              {selectedImageIndex + 1} /{" "}
              {imageList.length}
            </div>
          </div>

          {imageList.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              aria-label="Seuraava kuva"
              className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-2xl text-white transition hover:bg-white/25 sm:right-7"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}