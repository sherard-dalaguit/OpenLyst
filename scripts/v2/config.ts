import fs from "fs";
import path from "path";
import NotifierSettings, {
  INotifierSettings,
} from "@/database/notifier-settings.model";
import { CompanyConfig, FiltersConfig, TargetsConfig, V2Settings } from "./types";

const CONFIG_DIR = path.join(process.cwd(), "config");

export function loadTargets(): TargetsConfig {
  const raw = fs.readFileSync(path.join(CONFIG_DIR, "targets.json"), "utf-8");
  return JSON.parse(raw) as TargetsConfig;
}

export function loadFilters(): FiltersConfig {
  const raw = fs.readFileSync(path.join(CONFIG_DIR, "filters.json"), "utf-8");
  return JSON.parse(raw) as FiltersConfig;
}

export function defaultSettings(targets: TargetsConfig): V2Settings {
  return {
    mode: "v1",
    gate_mode: "wide_net",
    strict_remote_only: false,
    home_locations: [],
    freshness_days: 3,
    quiet_hours: null,
    enabled_company_ids: targets.companies.filter(c => c.enabled).map(c => c.id),
  };
}

/**
 * Settings live in MongoDB (FR-11 option c / FR-18): the Next.js app on Vercel
 * has a read-only filesystem, so a committed settings.json could never be
 * toggled from the UI, and the Action already has MONGODB_URI — no extra PAT
 * or write-back commits needed. Missing doc → defaults (mode v1, wide_net).
 */
export async function loadSettings(targets: TargetsConfig): Promise<V2Settings> {
  const doc = (await NotifierSettings.findOne({
    key: "singleton",
  }).lean()) as INotifierSettings | null;
  const defaults = defaultSettings(targets);
  if (!doc) return defaults;
  return {
    mode: doc.mode ?? defaults.mode,
    gate_mode: doc.gateMode ?? defaults.gate_mode,
    strict_remote_only: doc.strictRemoteOnly ?? defaults.strict_remote_only,
    home_locations: doc.homeLocations ?? defaults.home_locations,
    freshness_days: doc.freshnessDays ?? defaults.freshness_days,
    quiet_hours: doc.quietHours ?? null,
    enabled_company_ids:
      doc.enabledCompanyIds && doc.enabledCompanyIds.length > 0
        ? doc.enabledCompanyIds
        : defaults.enabled_company_ids,
  };
}

export function companyById(
  targets: TargetsConfig
): Map<string, CompanyConfig> {
  return new Map(targets.companies.map(c => [c.id, c]));
}

/** Exact match only (after stripping "Inc"/"The"/parentheticals) — prefix
 *  matching would mis-tag e.g. CircleCI as Circle. */
export function matchCompany(
  targets: TargetsConfig,
  companyName: string
): CompanyConfig | undefined {
  const norm = normalizeCompanyName(companyName);
  return targets.companies.find(
    c =>
      norm === c.id.replace(/[^a-z0-9]/g, "") ||
      norm === normalizeCompanyName(c.name)
  );
}

function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\(.*\)\s*$/, "")
    .replace(/^the\s+/, "")
    .replace(/[.,']/g, "")
    .replace(/\s+(inc|llc|ltd|co|corp|corporation|company|labs|technologies|technology|group)$/, "")
    .replace(/[^a-z0-9]/g, "");
}
