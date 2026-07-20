import sgMail from "@sendgrid/mail";
import { CompanyConfig, QuietHours, Role } from "./types";

export interface AnnotatedRole {
  role: Role;
  companyCfg?: CompanyConfig;
}

function policyChip(cfg?: CompanyConfig): string {
  if (!cfg) return "travel policy: unverified";
  if (cfg.travel_policy_days) {
    return `${cfg.travel_policy_days}d${cfg.per_country ? "/country" : "/yr total"}`;
  }
  if (cfg.travel_policy_confidence === "unverified") return "travel policy: unverified";
  return "flexible / see notes";
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDate(iso?: string): string {
  if (!iso) return "unknown";
  return new Date(iso).toISOString().slice(0, 10);
}

export function buildAlertEmail(items: AnnotatedRole[]): {
  subject: string;
  html: string;
  text: string;
} {
  const subject =
    items.length === 1
      ? `🚨 New grad SWE @ ${items[0].role.company} — apply now`
      : `🚨 ${items.length} new-grad SWE roles (intl-remote)`;

  const cards = items
    .map(({ role, companyCfg }) => {
      const chip = policyChip(companyCfg);
      const rare =
        companyCfg?.hires_new_grads === "rare"
          ? `<span style="background:#fef3c7;color:#92400e;border-radius:4px;padding:2px 6px;font-size:11px;margin-left:6px;">rarely hires new grads</span>`
          : "";
      const entityNote = companyCfg?.entity_dependent_cap
        ? `<p style="margin:6px 0 0;font-size:12px;color:#b45309;">⚠ Day cap may shrink in countries without a legal entity.</p>`
        : "";
      const notes = companyCfg?.notes
        ? `<p style="margin:6px 0 0;font-size:12px;color:#6b7280;">${esc(companyCfg.notes)}</p>`
        : "";
      const simplify = role.simplifyUrl
        ? ` <a href="${esc(role.simplifyUrl)}" target="_blank" style="font-size:13px;margin-left:10px;">Simplify autofill →</a>`
        : "";
      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;margin:0 0 16px;">
        <tr><td style="padding:16px;">
          <p style="margin:0 0 4px;">
            <strong style="font-size:15px;color:#111827;">${esc(role.company)}</strong>
            <span style="background:#dbeafe;color:#1e40af;border-radius:4px;padding:2px 6px;font-size:11px;margin-left:6px;">${esc(chip)}</span>
            ${rare}
          </p>
          <p style="margin:0 0 6px;font-size:17px;font-weight:600;color:#111827;">${esc(role.title)}</p>
          <p style="margin:0 0 2px;font-size:13px;color:#374151;">📍 ${esc(role.locations.slice(0, 5).join(" · ") || "Location unlisted")}</p>
          <p style="margin:0 0 10px;font-size:13px;color:#374151;">🗓 Added ${fmtDate(role.postedAt)} · via ${esc(role.sourceId)}</p>
          <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">Intl-remote policy: ${esc(companyCfg?.intl_policy ?? "unverified")} <em>(self-reported policy — verify with recruiter)</em></p>
          ${entityNote}
          ${notes}
          <p style="margin:12px 0 0;">
            <a href="${esc(role.applyUrl)}" target="_blank" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 22px;border-radius:6px;font-size:14px;font-weight:600;display:inline-block;">Apply</a>
            ${simplify}
          </p>
        </td></tr>
      </table>`;
    })
    .join("");

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;">
      <p style="font-size:16px;margin:0 0 4px;">🚨 <strong>${items.length} new-grad SWE role${items.length === 1 ? "" : "s"}</strong> detected this hour.</p>
      <p style="font-size:13px;color:#6b7280;margin:0 0 16px;">Speed matters — early applications get materially better callback odds.</p>
      ${cards}
      <p style="font-size:11px;color:#9ca3af;margin:16px 0 0;">OpenLyst v2 · intl-remote targeted. Policies are self-reported and often entity/country-dependent — always confirm with the recruiter.</p>
    </div>`;

  const text = items
    .map(({ role, companyCfg }) => {
      return [
        `${role.company} — ${role.title}${companyCfg?.hires_new_grads === "rare" ? " [rarely hires new grads]" : ""}`,
        `  Locations: ${role.locations.join(", ") || "unlisted"}`,
        `  Policy: ${policyChip(companyCfg)} (${companyCfg?.intl_policy ?? "unverified"}) — verify with recruiter`,
        `  Added: ${fmtDate(role.postedAt)} via ${role.sourceId}`,
        `  Apply: ${role.applyUrl}`,
        role.simplifyUrl ? `  Simplify: ${role.simplifyUrl}` : undefined,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return { subject, html, text };
}

const RETRY_DELAYS_MS = [2000, 8000];

export async function sendAlertEmail(items: AnnotatedRole[]): Promise<void> {
  const to = process.env.ALERT_EMAIL_TO;
  if (!to) throw new Error("ALERT_EMAIL_TO env var is not set");
  if (!process.env.SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY env var is not set");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const { subject, html, text } = buildAlertEmail(items);
  const msg = {
    to,
    from: { email: "no-reply@openlyst.io", name: "OpenLyst v2" },
    replyTo: "support@openlyst.io",
    subject,
    html,
    text,
  };

  let lastErr: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      await sgMail.send(msg);
      return;
    } catch (err) {
      lastErr = err;
      console.error(`[notifier] send attempt ${attempt + 1} failed:`, err);
      if (attempt < RETRY_DELAYS_MS.length) {
        await new Promise(r => setTimeout(r, RETRY_DELAYS_MS[attempt]));
      }
    }
  }
  throw lastErr;
}

/** FR-16: true while inside the configured quiet window (handles overnight wrap). */
export function inQuietHours(q: QuietHours | null, now = new Date()): boolean {
  if (!q) return false;
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: q.tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const hm = fmt.format(now); // "HH:mm"
  if (q.start <= q.end) return hm >= q.start && hm < q.end;
  return hm >= q.start || hm < q.end;
}
