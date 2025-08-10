import { api } from '@/lib/api';
import { NextResponse } from 'next/server';
import {runAllTests} from "@/scripts/testScraper";

export async function GET() {
	console.log('[api/run-all] -> handler hit');

	await runAllTests();
	await api.cron.dailyDigest();
	await api.cron.weeklyDigest();

	return NextResponse.json({ status: 'ok' });
}