export type AtsProvider =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "workday"
  | "smartrecruiters"
  | "custom";

export type TravelPolicyConfidence = "high" | "medium" | "verify" | "unverified";

export interface CompanyConfig {
  id: string;
  name: string;
  intl_policy: string;
  travel_policy_days: number | null;
  per_country: boolean;
  travel_policy_confidence: TravelPolicyConfidence;
  entity_dependent_cap: boolean;
  remote_first: boolean;
  hires_new_grads: "yes" | "rare" | "unknown";
  hire_from_anywhere: boolean;
  ph_coverage: string;
  tier: number | "eu_uk" | "permanent";
  ats_provider: AtsProvider;
  ats_token: string | null;
  careers_url: string | null;
  enabled: boolean;
  notes: string;
}

export interface TargetsConfig {
  companies: CompanyConfig[];
}

export interface FiltersConfig {
  newgrad_include: string[];
  seniority_exclude: string[];
  swe_include: string[];
  swe_exclude: string[];
}

export interface QuietHours {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
  tz: string; // IANA zone
}

export interface V2Settings {
  mode: "v1" | "v2";
  gate_mode: "strict_allowlist" | "wide_net";
  strict_remote_only: boolean;
  freshness_days: number;
  quiet_hours: QuietHours | null;
  enabled_company_ids: string[];
}

export interface Role {
  company: string;
  title: string;
  locations: string[];
  applyUrl: string;
  postedAt?: string; // ISO; best-effort per source
  sourceId: string; // "simplify" | "greenhouse" | "lever" | "ashby" | "workday" | "smartrecruiters"
  nativeId?: string;
  /** Set by curated new-grad feeds (SimplifyJobs): the source itself vouches the
   *  role is new-grad, so the title need not contain a new-grad phrase. */
  impliedNewGrad?: boolean;
  /** One-click Simplify autofill link when the source provides one (FR-13). */
  simplifyUrl?: string;
  /** Company config id this role was matched to, when known. */
  companyId?: string;
}

export interface SourceAdapter {
  id: string;
  fetchRoles(cfg: CompanyConfig): Promise<Role[]>;
}

export interface SourceHealth {
  sourceId: string;
  company?: string;
  ok: boolean;
  count: number;
  error?: string;
}
