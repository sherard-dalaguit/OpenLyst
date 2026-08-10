import { MetadataRoute } from "next";
import { jobFilters } from "@/constants/filters";

const BASE_URL = "https://www.openlyst.io";

const categoryFilter = jobFilters.find((filter) => filter.key === "category");
const categorySlugs = categoryFilter?.options?.map((option) => option.value) ?? [];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categorySlugs.map((slug) => ({
      url: `${BASE_URL}/jobs/${slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];
}
