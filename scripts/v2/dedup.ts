import crypto from "crypto";
import SeenRole from "@/database/seen-role.model";
import { Role } from "./types";
import { normalizeTitle } from "./filter";

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Identity is company+title (FR-9, minus the URL term): the same posting
 * reaches us through both the Simplify feed and the company's ATS with
 * different URLs, and including the URL would double-alert every such role.
 */
export function dedupeKeyFor(role: Role): string {
  return `${slug(role.company)}::${slug(normalizeTitle(role.title))}`;
}

export function jobIdFor(role: Role): string {
  if (role.nativeId) return `${role.sourceId}:${role.nativeId}`;
  const h = crypto
    .createHash("sha256")
    .update(`${role.company}|${normalizeTitle(role.title)}|${role.applyUrl || role.locations[0] || ""}`)
    .digest("hex");
  return `hash:${h.slice(0, 16)}`;
}

/** Intra-run dedupe (same role from multiple sources) keeping the richest entry. */
export function dedupeWithinRun(roles: Role[]): Role[] {
  const byKey = new Map<string, Role>();
  for (const role of roles) {
    const key = dedupeKeyFor(role);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, role);
      continue;
    }
    // Prefer the direct-ATS version (fresher postedAt, canonical URL) but keep
    // the Simplify autofill link from either.
    const preferred =
      existing.sourceId === "simplify" && role.sourceId !== "simplify"
        ? { ...role, simplifyUrl: role.simplifyUrl ?? existing.simplifyUrl }
        : { ...existing, simplifyUrl: existing.simplifyUrl ?? role.simplifyUrl };
    byKey.set(key, preferred);
  }
  return [...byKey.values()];
}

/** Roles whose dedupeKey is not yet in the seen-store. */
export async function filterUnseen(roles: Role[]): Promise<Role[]> {
  if (roles.length === 0) return [];
  const keys = roles.map(dedupeKeyFor);
  const seen = (await SeenRole.find({ dedupeKey: { $in: keys } })
    .select("dedupeKey")
    .lean()) as unknown as Array<{ dedupeKey: string }>;
  const seenKeys = new Set(seen.map(s => s.dedupeKey));
  return roles.filter(r => !seenKeys.has(dedupeKeyFor(r)));
}

export async function markSeen(
  roles: Role[],
  opts: { alerted: boolean; primed?: boolean }
): Promise<void> {
  if (roles.length === 0) return;
  const now = new Date();
  await SeenRole.bulkWrite(
    roles.map(role => ({
      updateOne: {
        filter: { dedupeKey: dedupeKeyFor(role) },
        update: {
          $setOnInsert: {
            dedupeKey: dedupeKeyFor(role),
            jobId: jobIdFor(role),
            company: role.company,
            title: role.title,
            applyUrl: role.applyUrl,
            sourceId: role.sourceId,
            firstSeenAt: now,
            primed: opts.primed ?? false,
          },
          $set: {
            alerted: opts.alerted,
            ...(opts.alerted ? { alertedAt: now } : {}),
          },
        },
        upsert: true,
      },
    }))
  );
}
