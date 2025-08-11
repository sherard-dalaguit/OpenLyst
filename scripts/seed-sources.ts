import mongoose from "mongoose";
import Source from "@/database/source.model";

const SOURCES = [
  { name: "RemoteOK", slug: "remoteok", baseUrl: "https://remoteok.com", enabled: true },
  { name: "Remotive", slug: "remotive", baseUrl: "https://remotive.com", enabled: true },
  { name: "SkipTheDrive", slug: "skipthedrive", baseUrl: "https://skipthedrive.com", enabled: true },
  { name: "We Work Remotely", slug: "weworkremotely", baseUrl: "https://weworkremotely.com", enabled: true },
  { name: "Jobspresso", slug: "jobspresso", baseUrl: "https://jobspresso.co", enabled: true },
  { name: "JavascriptJobs", slug: "javascriptjobs", baseUrl: "https://javascript.jobs", enabled: true },
  { name: "Working Nomads", slug: "workingnomads", baseUrl: "https://workingnomads.com", enabled: true },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  for (const s of SOURCES) {
    await Source.updateOne({ name: s.name }, { $setOnInsert: s }, { upsert: true });
  }
  console.log(`Seeded/ensured ${SOURCES.length} sources.`);
  // @ts-ignore
  console.log("DB:", mongoose.connection.db.databaseName);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
