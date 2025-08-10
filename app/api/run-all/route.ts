import { api } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
	console.log('[api/run-all] -> handler hit');

	await api.run_tests.runJavascriptJobsScraper();
	await api.run_tests.runJobspressoScraper();
	await api.run_tests.runRemoteOkScraper();
	await api.run_tests.runRemotiveScraper();
	await api.run_tests.runSkipTheDriveScraper();
	await api.run_tests.runWeWorkRemotelyScraper();
	await api.run_tests.runWorkingNomadsScraper();
	await api.cron.dailyDigest();
	await api.cron.weeklyDigest();

	return NextResponse.json({ status: 'ok' });
}