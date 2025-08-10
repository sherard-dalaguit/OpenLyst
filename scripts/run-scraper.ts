import { api } from '@/lib/api';

async function main() {
	console.log('[run-scraper] -> Starting scraper jobs...');

	const { api } = await import('../app/lib/api');

	await api.run_tests.runJavascriptJobsScraper();
	await api.run_tests.runJobspressoScraper();
	await api.run_tests.runRemoteOkScraper();
	await api.run_tests.runRemotiveScraper();
	await api.run_tests.runSkipTheDriveScraper();
	await api.run_tests.runWeWorkRemotelyScraper();
	await api.run_tests.runWorkingNomadsScraper();

	console.log('[run-scraper] -> Scraper jobs completed.');
}

main().catch((err) => {
  console.error('[scraper] fatal', err)
  process.exit(1)
})