import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PartnerGallery from "../../../components/partner/PartnerGallery";
import PartnerReviewForm from "../../../components/partner/PartnerReviewForm";

type PartnerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function cleanAndNormalizeServices(raw: unknown): string[] {
  if (!raw) return [];

  let value = Array.isArray(raw) ? raw.join(",") : String(raw);

  value = value
    .replace(/[\[\]\(\)"']/g, "")
    .replace(/&/g, ",")
    .replace(/\//g, ",");

  return Array.from(
    new Set(
      value
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean)
    )
  );
}

function cleanImages(raw: unknown): string[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((image) => String(image).trim())
      .filter(Boolean);
  }

  return String(raw)
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);
}

export default async function PartnerPage({
  params,
}: PartnerPageProps) {
  const { slug } = await params;

  const { data: partner, error } = await supabase
    .from("partners")
    .select(`
      id,
      company,
      description,
      category,
      services,
      area,
      address,
      website,
      logo_url,
      cover_image_url,
      images,
      min_guests,
      max_guests,
      avg_price_level,
      parking,
      accessibility,
      instagram_url,
      facebook_url,
      tiktok_url,
      opening_hours,
      slug
    `)
    .eq("slug", slug)
    .eq("status", "approved")
    .eq("profile_completed", true)
    .maybeSingle();

  if (error) {
    console.error("Partnerin julkisen profiilin lataus epäonnistui:", error);
    notFound();
  }

  if (!partner) {
    notFound();
  }
  const { data: reviews } = await supabase
  .from("partner_reviews")
  .select(`
    id,
    rating,
    review,
    created_at
  `)
  .eq("partner_id", partner.id)
  .eq("approved", true)
  .order("created_at", { ascending: false });

const averageRating =
  reviews && reviews.length > 0
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      ).toFixed(1)
    : null;

  const services = cleanAndNormalizeServices([
    partner.category,
    partner.services,
  ]);

  const galleryImages = cleanImages(partner.images);

  const images = Array.from(
    new Set(
      [
        partner.cover_image_url,
        ...galleryImages,
      ].filter(Boolean)
    )
  ) as string[];

  const mainImage = images[0] ?? "";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <div className="relative min-h-[280px] bg-zinc-800 sm:min-h-[420px]">
            {mainImage ? (
              <img
                src={mainImage}
                alt={`${partner.company} kansikuva`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                Ei kansikuvaa
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                {partner.logo_url && (
                  <img
                    src={partner.logo_url}
                    alt={`${partner.company} logo`}
                    className="h-24 w-24 rounded-2xl border border-white/20 bg-white object-contain p-2 shadow-xl"
                  />
                )}

                <div>
                  <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
                    OmatJuhlat-palveluntarjoaja
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                    {partner.company}
                  </h1>
                  {averageRating && (
  <div className="mt-3 flex items-center gap-2 text-yellow-400">
    <span className="text-xl">★★★★★</span>

    <span className="font-semibold text-white">
      {averageRating}
    </span>

    <span className="text-zinc-400">
      ({reviews?.length} arvostelua)
    </span>
  </div>
)}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-sm text-zinc-200 backdrop-blur"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              {partner.description && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">
                    Tietoa yrityksestä
                  </h2>

                  <p className="whitespace-pre-line leading-8 text-zinc-300">
                    {partner.description}
                  </p>
                </section>
              )}

              {galleryImages.length > 0 && (
  <section>
    <h2 className="mb-4 text-2xl font-semibold">
      Kuvagalleria
    </h2>

    <PartnerGallery
      images={galleryImages}
      company={partner.company}
    />
  </section>
)}
              {partner.opening_hours && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">
                    Aukioloajat
                  </h2>

                  <p className="whitespace-pre-line text-zinc-300">
                    {partner.opening_hours}
                  </p>
                </section>
              )}
              {reviews && reviews.length > 0 && (
  <section>
    <h2 className="mb-6 text-2xl font-semibold">
      Asiakkaiden arvostelut
    </h2>

    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-yellow-400">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>

            <span className="text-sm text-zinc-500">
              {new Date(review.created_at).toLocaleDateString("fi-FI")}
            </span>
          </div>

          {review.review && (
            <p className="whitespace-pre-line text-zinc-300">
              {review.review}
            </p>
          )}
        </div>
      ))}
    </div>
  </section>
)}
<PartnerReviewForm partnerId={partner.id} />
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <h2 className="mb-5 text-xl font-semibold">
                  Yrityksen tiedot
                </h2>

                <div className="space-y-4 text-sm">
                  {partner.area && (
                    <div>
                      <p className="text-zinc-500">Sijainti</p>
                      <p className="mt-1 text-zinc-200">{partner.area}</p>
                    </div>
                  )}

                  {(partner.min_guests || partner.max_guests) && (
                    <div>
                      <p className="text-zinc-500">Vierasmäärä</p>
                      <p className="mt-1 text-zinc-200">
                        {partner.min_guests && partner.max_guests
                          ? `${partner.min_guests}–${partner.max_guests} henkilöä`
                          : partner.max_guests
                            ? `Enintään ${partner.max_guests} henkilöä`
                            : `Vähintään ${partner.min_guests} henkilöä`}
                      </p>
                    </div>
                  )}

                  {partner.avg_price_level && (
                    <div>
                      <p className="text-zinc-500">Hintataso</p>
                      <p className="mt-1 text-zinc-200">
                        {partner.avg_price_level}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-zinc-500">Pysäköinti</p>
                    <p className="mt-1 text-zinc-200">
                      {partner.parking ? "Saatavilla" : "Ei ilmoitettu"}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">Esteettömyys</p>
                    <p className="mt-1 text-zinc-200">
                      {partner.accessibility
                        ? "Esteetön"
                        : "Ei ilmoitettu"}
                    </p>
                  </div>
                </div>
              </div>

              {(partner.website ||
                partner.instagram_url ||
                partner.facebook_url ||
                partner.tiktok_url) && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                    Verkossa
                  </h2>

                  <div className="space-y-3 text-sm">
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-emerald-400 hover:text-emerald-300"
                      >
                        Verkkosivu
                      </a>
                    )}

                    {partner.instagram_url && (
                      <a
                        href={partner.instagram_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-emerald-400 hover:text-emerald-300"
                      >
                        Instagram
                      </a>
                    )}

                    {partner.facebook_url && (
                      <a
                        href={partner.facebook_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-emerald-400 hover:text-emerald-300"
                      >
                        Facebook
                      </a>
                    )}

                    {partner.tiktok_url && (
                      <a
                        href={partner.tiktok_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-emerald-400 hover:text-emerald-300"
                      >
                        TikTok
                      </a>
                    )}
                  </div>
                </div>
              )}
              <Link
  href={`/browse?select=${partner.id}`}
  className="block w-full rounded-2xl bg-emerald-500 px-6 py-4 text-center font-semibold text-black transition hover:bg-emerald-400"
>
  ✓ Valitse palveluntarjoaja
</Link>

<Link
  href="/browse"
  className="block w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-center font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
>
  ← Takaisin selaamaan
</Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}