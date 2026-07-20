import { CompanyConfig, Role, SourceAdapter } from "../types";
import { fetchJson } from "./http";

// ats_token format: "host|tenant|site", e.g.
// "etsy.wd5.myworkdayjobs.com|etsy|Etsy_Careers"
interface WorkdayJob {
  title: string;
  externalPath: string; // "/job/<location>/<slug>_<reqId>"
  locationsText?: string;
  postedOn?: string; // "Posted Today" | "Posted Yesterday" | "Posted N Days Ago" | "Posted 30+ Days Ago"
  bulletFields?: string[];
}

const PAGE_SIZE = 20;
const MAX_PAGES = 10; // newest-first; 200 jobs covers hourly diffs even on high-volume tenants

export function parsePostedOn(postedOn?: string): string | undefined {
  if (!postedOn) return undefined;
  const now = Date.now();
  const t = postedOn.toLowerCase();
  let days: number | undefined;
  if (t.includes("today")) days = 0;
  else if (t.includes("yesterday")) days = 1;
  else {
    const m = t.match(/(\d+)\+?\s*days?\s*ago/);
    if (m) days = Number(m[1]) + (t.includes("+") ? 1 : 0);
  }
  if (days === undefined) return undefined;
  return new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
}

function publicJobUrl(host: string, tenant: string, site: string, externalPath: string): string {
  if (host.includes("myworkdaysite.com")) {
    return `https://${host}/recruiting/${tenant}/${site}${externalPath}`;
  }
  return `https://${host}/${site}${externalPath}`;
}

export const workdayAdapter: SourceAdapter = {
  id: "workday",
  async fetchRoles(cfg: CompanyConfig): Promise<Role[]> {
    const [host, tenant, site] = (cfg.ats_token ?? "").split("|");
    if (!host || !tenant || !site) {
      throw new Error(`workday ats_token malformed for ${cfg.id}: ${cfg.ats_token}`);
    }
    const endpoint = `https://${host}/wday/cxs/${tenant}/${site}/jobs`;
    const roles: Role[] = [];
    for (let page = 0; page < MAX_PAGES; page++) {
      const data = await fetchJson<{ total: number; jobPostings?: WorkdayJob[] }>(
        endpoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appliedFacets: {},
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
            searchText: "",
          }),
        }
      );
      const postings = data.jobPostings ?? [];
      for (const j of postings) {
        if (!j.externalPath) continue;
        const reqId = j.externalPath.match(/_([A-Za-z0-9-]+)$/)?.[1];
        roles.push({
          company: cfg.name,
          companyId: cfg.id,
          title: j.title,
          locations: j.locationsText ? [j.locationsText] : [],
          applyUrl: publicJobUrl(host, tenant, site, j.externalPath),
          postedAt: parsePostedOn(j.postedOn),
          sourceId: "workday",
          nativeId: reqId ?? j.externalPath,
        });
      }
      if (postings.length < PAGE_SIZE) break;
    }
    return roles;
  },
};
