import { MetadataRoute } from "next";

const BASE_URL = "https://www.openlyst.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}