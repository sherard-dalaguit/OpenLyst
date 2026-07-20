import { CompanyConfig, Role, SourceAdapter } from "../types";
import { fetchJson } from "./http";

interface LeverPosting {
  id: string;
  text: string;
  createdAt?: number; // ms epoch
  hostedUrl?: string;
  applyUrl?: string;
  country?: string;
  workplaceType?: string;
  categories?: { location?: string; allLocations?: string[] };
}

export const leverAdapter: SourceAdapter = {
  id: "lever",
  async fetchRoles(cfg: CompanyConfig): Promise<Role[]> {
    const postings = await fetchJson<LeverPosting[]>(
      `https://api.lever.co/v0/postings/${cfg.ats_token}?mode=json`
    );
    return (postings ?? []).map(p => ({
      company: cfg.name,
      companyId: cfg.id,
      title: p.text,
      locations:
        p.categories?.allLocations?.length
          ? p.categories.allLocations
          : [p.categories?.location].filter((x): x is string => !!x),
      applyUrl: p.hostedUrl ?? p.applyUrl ?? "",
      postedAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
      sourceId: "lever",
      nativeId: p.id,
    }));
  },
};
