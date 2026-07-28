import type {
  MetadataRoute,
} from "next";

import { supabase } from "@/lib/supabase";

const BASE_URL =
  "https://www.omatjuhlat.fi";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap =
    [
      {
        url: `${BASE_URL}/`,
        lastModified,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${BASE_URL}/browse`,
        lastModified,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/partner/apply`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/tietosuoja`,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.3,
      },
      {
        url: `${BASE_URL}/kayttoehdot`,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];

  const {
    data: partnerData,
    error,
  } = await supabase
    .from("public_partners")
    .select("slug")
    .not("slug", "is", null);

  if (error) {
    console.error(
      "Sitemapin partneriprofiilien lataaminen epäonnistui:",
      error,
    );

    return staticPages;
  }

  const partnerSlugs = [
    ...new Set(
      (partnerData ?? [])
        .map((partner) =>
          partner.slug?.trim(),
        )
        .filter(
          (
            slug,
          ): slug is string =>
            Boolean(slug),
        ),
    ),
  ];

  const partnerPages: MetadataRoute.Sitemap =
    partnerSlugs.map((slug) => ({
      url:
        `${BASE_URL}/partner/` +
        encodeURIComponent(slug),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [
    ...staticPages,
    ...partnerPages,
  ];
}