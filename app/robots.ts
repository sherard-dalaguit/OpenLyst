import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/jobs/", "/saved-jobs/", "/applied-jobs/", "/settings/", "/api/"],
    },
    sitemap: "https://www.openlyst.io/sitemap.xml",
  };
}