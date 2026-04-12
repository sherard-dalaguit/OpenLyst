import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Job from "@/database/job.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 86400) {
    return "today";
  }

  let value: number;
  let unit: string;

  if (diffInSeconds < 86400 * 7) {
    value = Math.floor(diffInSeconds / 86400);
    unit = "day";
  } else if (diffInSeconds < 86400 * 30) {
    value = Math.floor(diffInSeconds / (86400 * 7));
    unit = "week";
  } else if (diffInSeconds < 86400 * 365) {
    value = Math.floor(diffInSeconds / (86400 * 30));
    unit = "month";
  } else {
    value = Math.floor(diffInSeconds / (86400 * 365));
    unit = "year";
  }

  const plural = value === 1 ? "" : "s";
  return `${value} ${unit}${plural} ago`;
};

export function truncateByCommas(value: string, maxCommas = 2): string {
  const parts = value.split(',')
  if (parts.length <= maxCommas + 1) return value
  return parts.slice(0, maxCommas + 1).join(',') + '...'
}

export function parseSalary(
  text: string | undefined
): [number | undefined, number | undefined] {
  if (!text) return [undefined, undefined];

  const clean = text.replace(/[\$,€]/g, "").trim().toLowerCase();

  const parts = clean.split(/\s*[-–—]\s*/);

  const nums = parts
    .map(part => {
      const isK = part.endsWith("k");
      const raw = part.replace(/k$/, "").replace(/,/g, "");
      const n = parseFloat(raw);
      return isNaN(n) ? undefined : n * (isK ? 1000 : 1);
    })
    .filter((n): n is number => n !== undefined);

  if (nums.length === 0) {
    return [undefined, undefined];
  } else if (nums.length === 1) {
    return [nums[0], nums[0]];
  } else {
    return [Math.min(...nums), Math.max(...nums)];
  }
}

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Software Engineering": [
    "software engineer", "developer", "programmer",
    "full-stack", "fullstack", "full stack",
    "frontend", "front-end",
    "backend", "back-end",
    "mobile",
    "react", "angular", "vue",
    "node", "python", "java", "golang",
    "typescript", "ruby", "php", "rust", "swift", "kotlin",
    "c#", "c++", "rails", "django", "laravel"
  ],

  "Data": [
    "data scientist", "data engineer", "data analyst",
    "machine learning", "ml", "analytics",
    "business intelligence", "bi",
    "sql", "tableau", "spark", "dbt", "etl",
    "postgresql", "snowflake", "pandas"
  ],

  "Product Management": [
    "product manager", "product owner", "pm",
    "roadmap", "prioritization", "backlog", "stakeholder"
  ],

  "Design": [
    "designer", "ux designer", "ui designer",
    "user experience", "visual design", "figma", "sketch"
  ],

  "Marketing": [
    "marketing", "growth", "seo", "sem",
    "content marketing", "social media", "ppc", "email marketing"
  ],

  "Sales": [
    "sales", "business development", "account executive",
    "account manager", "salesforce"
  ],

  "Customer Support": [
    "customer support", "helpdesk", "technical support", "customer success"
  ],

  "DevOps": [
    "devops", "site reliability", "sre",
    "sysadmin", "cloud", "aws", "azure", "gcp",
    "docker", "kubernetes"
  ],

  "Quality Assurance": [
    "qa", "quality assurance", "test engineer",
    "automation testing", "manual testing"
  ],

  "Operations": [
    "operations", "project manager", "program manager",
    "logistics", "ops", "project management",
    "scrum master", "agile coach"
  ],

  "Other": []
};

export const CATEGORY_PRIORITY = [
  "Software Engineering",
  "Data",
  "Product Management",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "DevOps",
  "Quality Assurance",
  "Operations",
  "Other"
];

// matches kw as a whole word/phrase — avoids "pm" hitting "npm", "cs" hitting "css", etc.
function wordMatch(text: string, kw: string): boolean {
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<!\\w)${escaped}(?!\\w)`).test(text);
}

export function mapToBroadCategory(
  title: string,
  rawTags: string[]
): string {
  const normalizedTitle = title.toLowerCase();
  const tags = rawTags.map(t => t.toLowerCase());

  // we'll score title‐matches at 3× the value of tag‐matches
  const TITLE_WEIGHT = 3;
  const TAG_WEIGHT   = 1;

  // initialize scores
  const scores: Record<string, number> = {};
  for (const category of Object.keys(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
  }

  // 1) scan the title
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (wordMatch(normalizedTitle, kw)) {
        scores[category] += TITLE_WEIGHT;
      }
    }
  }

  // 2) scan the tags
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      for (const tag of tags) {
        if (wordMatch(tag, kw)) {
          scores[category] += TAG_WEIGHT;
        }
      }
    }
  }

  // 3) select the category with the highest score
  let bestCategory = "Other";
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    } else if (score === bestScore && score > 0) {
      // tie → use your predefined priority list
      const priorIndex = CATEGORY_PRIORITY.indexOf(bestCategory);
      const currIndex  = CATEGORY_PRIORITY.indexOf(category);
      if (currIndex < priorIndex) {
        bestCategory = category;
      }
    }
  }

  return bestCategory;
}

export function mapToJobType(rawTags: string[]): string {
  const tags = rawTags.map(t => t.toLowerCase());
  if (tags.includes("internship") || tags.includes("intern")) {
    return "Internship";
  }
  if (tags.includes("contract") || tags.includes("contractor") || tags.includes("freelance")) {
    return "Contract";
  }
  if (tags.includes("part-time") || tags.includes("part time")) {
    return "Part-Time";
  }
  return tags.includes("full-time") ? "Full-Time" : "Full-Time";
}

export function slugToLabel(slug: string, joiner: "-" | " " = "-") {
  return slug
    .split("_")
    .map(word =>
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase()
    )
    .join(joiner);
}

export async function countJobsSince(since: Date) {
  return Job.countDocuments({
    postedAt: { $gt: since },
  }).exec()
}

export function formatCategoryTitle(category: string): string {
  if (!category) return "";
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function pushCategoryRoute(
  router: { push: (url: string, opts?: any) => void },
  searchParams: URLSearchParams,
  newCategory: string | null
) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("category");

  const basePath = newCategory ? `/jobs/${newCategory}` : `/jobs`;
  const query = params.toString();

  router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
}