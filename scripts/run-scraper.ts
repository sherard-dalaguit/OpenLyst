import mongoose from "mongoose";
import pLimit from "p-limit";
import {
	testJavascriptJobsScraper,
	testJobspressoScraper,
	testRemoteOkScraper,
	testRemotiveScraper,
	testSkipTheDriveScraper,
	testWeWorkRemotelyScraper,
	testWorkingNomadsScraper
} from "@/scripts/testScraper";
import dbConnect from "@/lib/mongoose";

async function main() {
  await dbConnect();
  const limit = pLimit(2);
  const tasks = [
    () => testJavascriptJobsScraper(),
		() => testJobspressoScraper(),
		() => testRemoteOkScraper(),
		() => testSkipTheDriveScraper(),
		() => testWeWorkRemotelyScraper(),
		() => testWorkingNomadsScraper(),
		() => testRemotiveScraper(),
  ];
  const results = await Promise.allSettled(tasks.map(t => limit(t)));
  results.forEach((r, i) => console.log(`[scraper ${i}]`, r.status, r));
  await mongoose.disconnect();

  if (results.every(r => r.status === "rejected")) process.exit(1);
}
main().catch(e => { console.error(e); process.exit(1); });