import { CompanyConfig, FiltersConfig, Role, V2Settings } from "./types";

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[-_/|,()[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const regexCache = new Map<string, RegExp>();

function phraseRegex(phrase: string): RegExp {
  let re = regexCache.get(phrase);
  if (!re) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    re = new RegExp(`\\b${escaped}\\b`, "i");
    regexCache.set(phrase, re);
  }
  return re;
}

export function matchesAny(normalizedTitle: string, phrases: string[]): boolean {
  return phrases.some(p => phraseRegex(p).test(normalizedTitle));
}

export function looksRemote(locations: string[]): boolean {
  return locations.some(l =>
    /remote|anywhere|worldwide|work from home|wfh|distributed/i.test(l)
  );
}

function ageInDays(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000);
}

export interface FilterVerdict {
  ok: boolean;
  reason?: string;
}

/**
 * SRS §8. `companyCfg` is the matched allowlist entry, if any. Exclusions win
 * over inclusions; roles from curated new-grad feeds (`impliedNewGrad`) skip
 * the new-grad phrase requirement — the feed itself is the signal — but still
 * go through seniority/SWE checks.
 */
export function qualifies(
  role: Role,
  settings: V2Settings,
  filters: FiltersConfig,
  companyCfg: CompanyConfig | undefined
): FilterVerdict {
  const t = normalizeTitle(role.title);

  if (matchesAny(t, filters.seniority_exclude)) {
    return { ok: false, reason: "seniority-exclude" };
  }
  if (matchesAny(t, filters.swe_exclude)) {
    return { ok: false, reason: "swe-exclude" };
  }
  if (!matchesAny(t, filters.swe_include)) {
    return { ok: false, reason: "not-swe" };
  }
  if (!role.impliedNewGrad && !matchesAny(t, filters.newgrad_include)) {
    return { ok: false, reason: "not-newgrad" };
  }

  if (settings.gate_mode === "strict_allowlist") {
    const confirmed =
      companyCfg &&
      companyCfg.tier !== "permanent" &&
      settings.enabled_company_ids.includes(companyCfg.id);
    if (!confirmed) return { ok: false, reason: "not-in-allowlist" };
  }

  if (role.postedAt && ageInDays(role.postedAt) > settings.freshness_days) {
    return { ok: false, reason: "stale" };
  }

  if (settings.strict_remote_only && !looksRemote(role.locations)) {
    return { ok: false, reason: "not-remote" };
  }

  return { ok: true };
}
