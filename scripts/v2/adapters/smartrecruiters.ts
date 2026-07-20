import { CompanyConfig, Role, SourceAdapter } from "../types";
import { fetchJson } from "./http";

interface SmartRecruitersPosting {
  id: string;
  name: string;
  releasedDate?: string;
  location?: { city?: string; region?: string; country?: string; remote?: boolean };
}

export const smartRecruitersAdapter: SourceAdapter = {
  id: "smartrecruiters",
  async fetchRoles(cfg: CompanyConfig): Promise<Role[]> {
    const data = await fetchJson<{
      totalFound: number;
      content: SmartRecruitersPosting[];
    }>(
      `https://api.smartrecruiters.com/v1/companies/${cfg.ats_token}/postings?limit=100`
    );
    return (data.content ?? []).map(p => {
      const loc = [
        p.location?.remote ? "Remote" : undefined,
        p.location?.city,
        p.location?.country?.toUpperCase(),
      ].filter((x): x is string => !!x);
      return {
        company: cfg.name,
        companyId: cfg.id,
        title: p.name,
        locations: loc,
        applyUrl: `https://jobs.smartrecruiters.com/${cfg.ats_token}/${p.id}`,
        postedAt: p.releasedDate,
        sourceId: "smartrecruiters",
        nativeId: p.id,
      };
    });
  },
};
