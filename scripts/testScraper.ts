import Job from "@/database/job.model";
import dbConnect from "@/lib/mongoose";
import {scrapeRemoteOK} from "@/scrapers/remoteok";

export async function testScraper() {
  await dbConnect();

  await Job.deleteMany({ sourceName: "RemoteOk" });

  console.log("Running scrapeRemoteOK…");
  const inserted = await scrapeRemoteOK();
  console.log(`scrapeRemoteOK returned count = ${inserted}`);

  const docs = await Job.find({ sourceName: "RemoteOk" }).lean();
  console.log(`Found ${docs.length} documents in the jobs collection.`);
  console.log("Sample entry:", docs[0]);

  console.log("Re-running scraper to test upsert…");
  const inserted2 = await scrapeRemoteOK();
  const totalAfter = await Job.countDocuments({ sourceName: "RemoteOk" });
  console.log(`Second run returned ${inserted2}, total docs now = ${totalAfter}`);

  process.exit(0);
}

testScraper().catch(err => {
  console.error(err);
  process.exit(1);
});
