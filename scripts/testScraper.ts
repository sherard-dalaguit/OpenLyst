import Job from "@/database/job.model";
import dbConnect from "@/lib/mongoose";
import {scrapeRemoteOK} from "@/scrapers/remoteok";
import {scrapeWeWorkRemotely} from "@/scrapers/weworkremotely";
import {scrapeRemotive} from "@/scrapers/remotive";
import { scrapeJobspresso } from "@/scrapers/jobspresso";
import { scrapeJavascriptJobs } from "@/scrapers/javascriptjobs";
import {scrapeWorkingNomads} from "@/scrapers/workingnomads";
import {scrapeSkipTheDrive} from "@/scrapers/skipthedrive";

export async function testRemoteOkScraper() {
  await dbConnect();

  // await Job.deleteMany({ sourceName: "RemoteOk" });

  console.log("Running scrapeRemoteOK…");
  const inserted = await scrapeRemoteOK();
  console.log(`scrapeRemoteOK returned count = ${inserted}`);

  const docs = await Job.find({ sourceName: "RemoteOk" }).lean();
  console.log(`Found ${docs.length} documents in the jobs collection.`);
  console.log("Sample entry:", docs[0]);
}

export async function testWeWorkRemotelyScraper() {
  await dbConnect();

  // await Job.deleteMany({ sourceName: "WeWorkRemotely" });

  console.log("Running scrapeWeWorkRemotely…");
  const inserted = await scrapeWeWorkRemotely();
  console.log(`scrapeWeWorkRemotely returned count = ${inserted}`);

  const docs = await Job.find({ sourceName: "WeWorkRemotely" }).lean();
  console.log(`Found ${docs.length} documents in the jobs collection.`);
  console.log("Sample entry:", docs[0]);
}

export async function testRemotiveScraper() {
  await dbConnect();

  // await Job.deleteMany({ sourceName: "Remotive" });

  console.log("Running scrapeRemotive…");
  const inserted = await scrapeRemotive();
  console.log(`scrapeRemotive returned count = ${inserted}`);

  const docs = await Job.find({ sourceName: "Remotive" }).lean();
  console.log(`Found ${docs.length} documents in the jobs collection.`);
  console.log("Sample entry:", docs[0]);
}

export async function testJobspressoScraper() {
  await dbConnect();

  // await Job.deleteMany({ sourceName: "Jobspresso" });

  console.log("Running scrapeJobspresso…");
  const inserted = await scrapeJobspresso();
  console.log(`scrapeJobspresso returned count = ${inserted}`);

  const docs = await Job.find({ sourceName: "Jobspresso" }).lean();
  console.log(`Found ${docs.length} documents in the jobs collection.`);
  console.log("Sample entry:", docs[0]);
}

export async function testJavascriptJobsScraper() {
  await dbConnect();

  // await Job.deleteMany({ sourceName: "JavascriptJobs" });

  console.log("Running scrapeJavascriptJobs…");
  const inserted = await scrapeJavascriptJobs();
  console.log(`scrapeJavascriptJobs returned count = ${inserted}`);

  const docs = await Job.find({ sourceName: "JavascriptJobs" }).lean();
  console.log(`Found ${docs.length} documents in the jobs collection.`);
  console.log("Sample entry:", docs[0]);
}

export async function testWorkingNomadsScraper() {
  await dbConnect();

  // await Job.deleteMany({ sourceName: "WorkingNomads" });

  console.log("Running scrapeWorkingNomads…");
  const inserted = await scrapeWorkingNomads();
  console.log(`scrapeWorkingNomads returned count = ${inserted}`);

  const docs = await Job.find({ sourceName: "WorkingNomads" }).lean();
  console.log(`Found ${docs.length} documents in the jobs collection.`);
  console.log("Sample entry:", docs[0]);
}

export async function testSkipTheDriveScraper() {
  await dbConnect();

  // await Job.deleteMany({ sourceName: "SkipTheDrive" });

  console.log("Running scrapeSkipTheDrive…");
  const inserted = await scrapeSkipTheDrive();
  console.log(`scrapeSkipTheDrive returned count = ${inserted}`);

  const docs = await Job.find({ sourceName: "SkipTheDrive" }).lean();
  console.log(`Found ${docs.length} documents in the jobs collection.`);
  console.log("Sample entry:", docs[0]);
}

export async function runAllTests() {
  await testRemoteOkScraper();
  await testWeWorkRemotelyScraper();
  await testRemotiveScraper();
  await testJobspressoScraper();
  await testJavascriptJobsScraper();
  await testWorkingNomadsScraper();
  await testSkipTheDriveScraper();

  console.log("All tests completed successfully.");
  process.exit(0);
}