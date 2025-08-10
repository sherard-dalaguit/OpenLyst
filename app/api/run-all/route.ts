import { api } from '@/lib/api';
import { NextResponse } from 'next/server';
import {
	testJavascriptJobsScraper,
	testJobspressoScraper,
	testRemoteOkScraper,
	testRemotiveScraper,
	testSkipTheDriveScraper,
	testWeWorkRemotelyScraper,
	testWorkingNomadsScraper
} from "@/scripts/testScraper";

export async function GET() {
	console.log('[api/run-all] -> handler hit');

	await testWorkingNomadsScraper();
  await testSkipTheDriveScraper();
  await testWeWorkRemotelyScraper();
  await testJobspressoScraper();
  await testJavascriptJobsScraper();
  await testRemoteOkScraper();
  await testRemotiveScraper();
	await api.cron.dailyDigest();
	await api.cron.weeklyDigest();

	return NextResponse.json({ status: 'ok' });
}