import { CompanyConfig, Role, SourceAdapter } from "../types";
import { fetchJson } from "./http";

interface GreenhouseJob {
  id: number;
  title: string;
  updated_at?: string;
  first_published?: string;
  absolute_url: string;
  location?: { name?: string };
  offices?: { name?: string }[];
}

export const greenhouseAdapter: SourceAdapter = {
  id: "greenhouse",
  async fetchRoles(cfg: CompanyConfig): Promise<Role[]> {
    const data = await fetchJson<{ jobs: GreenhouseJob[] }>(
      `https://boards-api.greenhouse.io/v1/boards/${cfg.ats_token}/jobs`
    );
    return (data.jobs ?? []).map(j => ({
      company: cfg.name,
      companyId: cfg.id,
      title: j.title,
      locations: [
        j.location?.name,
        ...(j.offices?.map(o => o.name) ?? []),
      ].filter((x): x is string => !!x),
      applyUrl: j.absolute_url,
      // The boards API exposes first_published only on some boards; updated_at
      // is a conservative fallback (may re-surface edited old posts, which the
      // seen-store then dedupes).
      postedAt: j.first_published ?? j.updated_at,
      sourceId: "greenhouse",
      nativeId: String(j.id),
    }));
  },
};
