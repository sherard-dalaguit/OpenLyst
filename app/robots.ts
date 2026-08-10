import { MetadataRoute } from "next";

const BASE_URL = "https://www.openlyst.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/saved-jobs", "/applied-jobs", "/settings", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
