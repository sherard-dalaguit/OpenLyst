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

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const limit = pLimit(2);
  const tasks = [
    () => testJavascriptJobsScraper(),
		() => testJobspressoScraper(),
		() => testRemoteOkScraper(),
		() => testRemotiveScraper(),
		() => testSkipTheDriveScraper(),
		() => testWeWorkRemotelyScraper(),
		() => testWorkingNomadsScraper(),
  ];
  const results = await Promise.allSettled(tasks.map(t => limit(t)));
  results.forEach((r, i) => console.log(`[scraper ${i}]`, r.status, r));
  await mongoose.disconnect();

  if (results.every(r => r.status === "rejected")) process.exit(1);
}
main().catch(e => { console.error(e); process.exit(1); });