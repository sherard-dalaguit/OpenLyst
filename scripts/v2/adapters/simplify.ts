import { Role } from "../types";
import { fetchJson } from "./http";

const LISTINGS_URL =
  "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/.github/scripts/listings.json";

// The repo's README table is generated from this JSON; parsing the JSON is the
// stable form of FR-1 (the README's 🔒/age markers correspond to `active` and
// `date_posted` here).
const SWE_CATEGORIES = new Set(["Software", "Software Engineering"]);

interface SimplifyListing {
  source: string;
  category: string;
  company_name: string;
  id: string;
  title: string;
  active: boolean;
  date_updated: number;
  date_posted: number; // unix seconds
  url: string;
  locations: string[];
  company_url: string;
  is_visible: boolean;
  sponsorship: string;
  degrees: string[];
}

export async function fetchSimplifyRoles(): Promise<Role[]> {
  const listings = await fetchJson<SimplifyListing[]>(LISTINGS_URL, {}, 120000);
  return listings
    .filter(
      l =>
        l.active &&
        l.is_visible !== false &&
        SWE_CATEGORIES.has(l.category) &&
        !(l.degrees?.length && !l.degrees.includes("Bachelor's"))
    )
    .map(l => ({
      company: l.company_name,
      title: l.title,
      locations: l.locations ?? [],
      applyUrl: l.url,
      postedAt: l.date_posted
        ? new Date(l.date_posted * 1000).toISOString()
        : undefined,
      sourceId: "simplify",
      nativeId: l.id,
      impliedNewGrad: true,
      simplifyUrl: l.id ? `https://simplify.jobs/p/${l.id}` : undefined,
    }));
}
