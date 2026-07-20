import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import NotifierSettings from "@/database/notifier-settings.model";
import targets from "@/config/targets.json";

// Global v2-notifier settings (single-user app): the hourly Action reads this
// same Mongo document at runtime, so a toggle here changes the next scheduled
// run without a deploy (FR-17/FR-18, AC-5).

function defaultEnabledIds(): string[] {
  return targets.companies.filter(c => c.enabled).map(c => c.id);
}

export async function GET() {
  await dbConnect();
  const doc = await NotifierSettings.findOne({ key: "singleton" }).lean();

  const companies = targets.companies.map(c => ({
    id: c.id,
    name: c.name,
    tier: c.tier,
    intl_policy: c.intl_policy,
    pollable: c.enabled,
    hires_new_grads: c.hires_new_grads,
  }));

  return NextResponse.json({
    success: true,
    data: {
      settings: doc ?? {
        key: "singleton",
        mode: "v1",
        gateMode: "wide_net",
        strictRemoteOnly: false,
        homeLocations: [],
        freshnessDays: 3,
        quietHours: null,
        enabledCompanyIds: defaultEnabledIds(),
      },
      companies,
    },
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  await dbConnect();

  const update: Record<string, unknown> = {};
  if (body.mode === "v1" || body.mode === "v2") update.mode = body.mode;
  if (body.gateMode === "strict_allowlist" || body.gateMode === "wide_net") {
    update.gateMode = body.gateMode;
  }
  if (typeof body.strictRemoteOnly === "boolean") {
    update.strictRemoteOnly = body.strictRemoteOnly;
  }
  if (
    Array.isArray(body.homeLocations) &&
    body.homeLocations.every((x: unknown) => typeof x === "string")
  ) {
    update.homeLocations = (body.homeLocations as string[])
      .map(s => s.trim())
      .filter(Boolean);
  }
  if (
    typeof body.freshnessDays === "number" &&
    body.freshnessDays >= 1 &&
    body.freshnessDays <= 30
  ) {
    update.freshnessDays = body.freshnessDays;
  }
  if (body.quietHours === null) update.quietHours = null;
  if (
    body.quietHours &&
    typeof body.quietHours.start === "string" &&
    typeof body.quietHours.end === "string" &&
    typeof body.quietHours.tz === "string"
  ) {
    update.quietHours = body.quietHours;
  }
  if (
    Array.isArray(body.enabledCompanyIds) &&
    body.enabledCompanyIds.every((x: unknown) => typeof x === "string")
  ) {
    update.enabledCompanyIds = body.enabledCompanyIds;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { success: false, error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const doc = await NotifierSettings.findOneAndUpdate(
    { key: "singleton" },
    {
      $set: update,
      $setOnInsert: {
        key: "singleton",
        ...(update.enabledCompanyIds ? {} : { enabledCompanyIds: defaultEnabledIds() }),
      },
    },
    { new: true, upsert: true }
  ).lean();

  return NextResponse.json({ success: true, data: { settings: doc } });
}
