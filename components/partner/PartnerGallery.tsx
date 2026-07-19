type PartnerGalleryProps = {
  images?: string[] | string | null;
  companyName?: string;
};

function normalizeImages(images: PartnerGalleryProps["images"]) {
  if (!images) {
    return [];
  }

  if (Array.isArray(images)) {
    return images
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return images
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);
}

export default function PartnerGallery({
  images,
  companyName = "Partneriyritys",
}: PartnerGalleryProps) {
  const imageList = normalizeImages(images);

  if (imageList.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 px-6 text-center">
        <div>
          <div className="text-4xl">🖼️</div>
          <p className="mt-3 text-sm text-zinc-500">
            Yrityksellä ei ole vielä kuvia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {imageList.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 ${
            index === 0 && imageList.length > 2
              ? "sm:col-span-2"
              : ""
          }`}
        >
          <img
            src={image}
            alt={`${companyName}, kuva ${index + 1}`}
            className={`w-full object-cover ${
              index === 0 && imageList.length > 2
                ? "h-80"
                : "h-56"
            }`}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
}