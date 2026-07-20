import { CompanyConfig, Role, SourceAdapter } from "../types";
import { fetchJson } from "./http";

interface AshbyJob {
  id: string;
  title: string;
  location?: string;
  secondaryLocations?: { location?: string }[];
  publishedAt?: string;
  isListed?: boolean;
  isRemote?: boolean;
  jobUrl?: string;
  applyUrl?: string;
}

export const ashbyAdapter: SourceAdapter = {
  id: "ashby",
  async fetchRoles(cfg: CompanyConfig): Promise<Role[]> {
    const data = await fetchJson<{ jobs: AshbyJob[] }>(
      `https://api.ashbyhq.com/posting-api/job-board/${cfg.ats_token}`
    );
    return (data.jobs ?? [])
      .filter(j => j.isListed !== false)
      .map(j => ({
        company: cfg.name,
        companyId: cfg.id,
        title: j.title,
        locations: [
          j.isRemote ? "Remote" : undefined,
          j.location,
          ...(j.secondaryLocations?.map(s => s.location) ?? []),
        ].filter((x): x is string => !!x),
        applyUrl: j.jobUrl ?? j.applyUrl ?? "",
        postedAt: j.publishedAt,
        sourceId: "ashby",
        nativeId: j.id,
      }));
  },
};
