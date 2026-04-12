import { MetadataRoute } from "next";

const BASE_URL = "https://www.openlyst.io";

const categories = [
  "software_engineering",
  "data",
  "product_management",
  "design",
  "devops",
  "marketing",
  "sales",
  "customer_support",
  "quality_assurance",
  "operations",
  "other",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryPages = categories.map((category) => ({
    url: `${BASE_URL}/jobs/${category}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/jobs`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categoryPages,
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}