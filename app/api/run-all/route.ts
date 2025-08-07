import { api } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
	console.log('[api/run-all] -> handler hit');

	await api.cron.runScraper();
	await api.cron.dailyDigest();
	await api.cron.weeklyDigest();

	return NextResponse.json({ status: 'ok' });
}