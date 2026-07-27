import type {
  MetadataRoute,
} from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/login",

        "/partner/dashboard",
        "/partner/profile",
        "/partner/quotes",
        "/partner/calendar",
        "/partner/settings",
        "/partner/onboarding",
        "/partner/login",
        "/partner/forgot-password",
        "/partner/reset-password",
        "/partner/complete",

        "/quote/",
        "/direct-request/",
      ],
    },

    sitemap:
      "https://www.omatjuhlat.fi/sitemap.xml",

    host:
      "https://www.omatjuhlat.fi",
  };
}