import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { loadTargets, loadFilters, loadSettings, matchCompany } from "./config";
import { CompanyConfig, Role, SourceAdapter, SourceHealth } from "./types";
import { greenhouseAdapter } from "./adapters/greenhouse";
import { leverAdapter } from "./adapters/lever";
import { ashbyAdapter } from "./adapters/ashby";
import { workdayAdapter } from "./adapters/workday";
import { smartRecruitersAdapter } from "./adapters/smartrecruiters";
import { fetchSimplifyRoles } from "./adapters/simplify";
import { jitter } from "./adapters/http";
import { qualifies } from "./filter";
import { dedupeKeyFor, dedupeWithinRun, filterUnseen, markSeen } from "./dedup";
import { AnnotatedRole, inQuietHours, sendAlertEmail } from "./notifier";

const ADAPTERS: Record<string, SourceAdapter> = {
  greenhouse: greenhouseAdapter,
  lever: leverAdapter,
  ashby: ashbyAdapter,
  workday: workdayAdapter,
  smartrecruiters: smartRecruitersAdapter,
};

interface RunFlags {
  prime: boolean; // mark everything seen, never email (first-run priming)
  dryRun: boolean; // full pipeline, print matches, no email, no state writes
  force: boolean; // run even when settings.mode !== "v2"
}

function parseFlags(argv: string[]): RunFlags {
  return {
    prime: argv.includes("--prime"),
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
  };
}

async function scrapeAll(
  companies: CompanyConfig[]
): Promise<{ roles: Role[]; health: SourceHealth[] }> {
  const roles: Role[] = [];
  const health: SourceHealth[] = [];

  try {
    const simplifyRoles = await fetchSimplifyRoles();
    roles.push(...simplifyRoles);
    health.push({ sourceId: "simplify", ok: true, count: simplifyRoles.length });
  } catch (err) {
    health.push({
      sourceId: "simplify",
      ok: false,
      count: 0,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  for (const cfg of companies) {
    const adapter = ADAPTERS[cfg.ats_provider];
    if (!adapter || !cfg.ats_token) continue;
    try {
      const companyRoles = await adapter.fetchRoles(cfg);
      roles.push(...companyRoles);
      health.push({
        sourceId: cfg.ats_provider,
        company: cfg.id,
        ok: true,
        count: companyRoles.length,
      });
    } catch (err) {
      // Never let one broken source kill the run (SRS §7 / AC-1).
      health.push({
        sourceId: cfg.ats_provider,
        company: cfg.id,
        ok: false,
        count: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    await jitter();
  }

  return { roles, health };
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  await dbConnect();

  const targets = loadTargets();
  const filters = loadFilters();
  const settings = await loadSettings(targets);

  console.log(
    `[v2] mode=${settings.mode} gate=${settings.gate_mode} fresh=${settings.freshness_days}d ` +
      `strictRemote=${settings.strict_remote_only} home=[${settings.home_locations.join(", ")}] ` +
      `flags=${JSON.stringify(flags)}`
  );

  if (settings.mode !== "v2" && !flags.force && !flags.prime) {
    console.log("[v2] settings.mode is not 'v2' — early exit (AC-4).");
    await mongoose.disconnect();
    return;
  }

  const enabledCompanies = targets.companies.filter(
    c => c.enabled && settings.enabled_company_ids.includes(c.id)
  );
  console.log(
    `[v2] polling ${enabledCompanies.length} company boards + SimplifyJobs feed`
  );

  const { roles, health } = await scrapeAll(enabledCompanies);
  for (const h of health) {
    const label = h.company ? `${h.sourceId}/${h.company}` : h.sourceId;
    console.log(
      h.ok
        ? `[health] ${label}: OK (${h.count} roles)`
        : `[health] ${label}: FAILED — ${h.error}`
    );
  }

  const companyIndex = new Map(targets.companies.map(c => [c.id, c]));
  const annotated: AnnotatedRole[] = [];
  const reasonCounts: Record<string, number> = {};

  for (const role of dedupeWithinRun(roles)) {
    const companyCfg = role.companyId
      ? companyIndex.get(role.companyId)
      : matchCompany(targets, role.company);
    const verdict = qualifies(role, settings, filters, companyCfg);
    if (verdict.ok) {
      annotated.push({ role, companyCfg });
    } else {
      reasonCounts[verdict.reason ?? "?"] = (reasonCounts[verdict.reason ?? "?"] ?? 0) + 1;
    }
  }
  console.log(
    `[v2] scraped=${roles.length} qualified=${annotated.length} rejected=${JSON.stringify(reasonCounts)}`
  );

  if (flags.prime) {
    // Prime the seen-store with every currently-listed qualifying role so the
    // first live run only alerts on genuinely new postings. Non-qualifying
    // roles need no priming — they can never alert.
    await markSeen(annotated.map(a => a.role), { alerted: false, primed: true });
    console.log(`[v2] PRIMED ${annotated.length} roles (no emails sent).`);
    await mongoose.disconnect();
    return;
  }

  const fresh = await filterUnseen(annotated.map(a => a.role));
  const freshKeys = new Set(fresh.map(dedupeKeyFor));
  const toAlert = annotated.filter(a => freshKeys.has(dedupeKeyFor(a.role)));

  console.log(`[v2] new (unseen) qualifying roles: ${toAlert.length}`);
  for (const a of toAlert) {
    console.log(`  • ${a.role.company} — ${a.role.title} [${a.role.sourceId}]`);
  }

  if (toAlert.length === 0) {
    await mongoose.disconnect();
    return;
  }

  if (flags.dryRun) {
    console.log("[v2] DRY RUN — no email sent, no state written.");
    await mongoose.disconnect();
    return;
  }

  if (inQuietHours(settings.quiet_hours)) {
    // Hold: do not send and do not mark seen, so the next run outside the
    // window picks these up (FR-16).
    console.log("[v2] inside quiet hours — holding alerts for next run.");
    await mongoose.disconnect();
    return;
  }

  try {
    await sendAlertEmail(toAlert);
    await markSeen(toAlert.map(a => a.role), { alerted: true });
    console.log(`[v2] ✓ alert sent for ${toAlert.length} role(s) and marked seen.`);
  } catch (err) {
    // FR-15: leave unmarked so the next run retries.
    console.error("[v2] ✗ alert send failed after retries; roles left unmarked:", err);
    await mongoose.disconnect();
    process.exit(1);
  }

  await mongoose.disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
