import { api } from '@/lib/api';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import NotifierSettings from '@/database/notifier-settings.model';

export async function GET() {
	console.log('[api/run-all] -> handler hit');

	// Modes are mutually exclusive (SRS §3): while the v2 real-time notifier is
	// active, the v1 digests stand down. Flipping the settings toggle restores
	// them on the next scheduled run — no deploy needed (AC-4/AC-5).
	await dbConnect();
	const settings = await NotifierSettings.findOne({ key: 'singleton' }).lean() as { mode?: string } | null;
	if (settings?.mode === 'v2') {
		console.log('[api/run-all] mode=v2 — skipping v1 digests');
		return NextResponse.json({ status: 'skipped', reason: 'mode=v2' });
	}

	await api.cron.dailyDigest();
	await api.cron.weeklyDigest();

	return NextResponse.json({ status: 'ok' });
}