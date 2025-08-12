import { NextResponse } from 'next/server'
import dbConnect from "@/lib/mongoose";
import User from '@/database/user.model';
import {gatherNewJobs, sendJobDigestEmail} from "@/scripts/emailService";

export async function GET() {
  console.log('[cron/daily] -> handler hit')
  await dbConnect()
  const since = new Date(Date.now() - 23 * 60 * 60 * 1000)
  const users = await User.find({
    'preferences.receiveAlerts': true,
    'preferences.frequency': 'daily',
    $or: [
      { 'preferences.lastSentAtDaily': { $lte: since } },
      { 'preferences.lastSentAtDaily': { $exists: false } }
    ]
  }).lean()
  console.log(`[cron/daily] Found ${users.length} users to email`)

  for (const u of users) {
    console.log(`[cron/daily] → processing ${u.email}`)
    const jobs = await gatherNewJobs(since, u.preferences.categories)
    console.log(`  • ${jobs.length} new jobs`)

    try {
      await sendJobDigestEmail(
        u.email,
        u.name || 'there',
        jobs,
        u.preferences.unsubscribeToken,
        'daily'
      )
      console.log(`  ✓ Sent email to ${u.email}`)

			await User.findByIdAndUpdate(u._id, {
				'preferences.lastSentAtDaily': new Date()
			})
    } catch (error) {
      console.error(`  ✗ Error sending to ${u.email}`, error)
    }
  }

  return NextResponse.json({ status: 'ok', sent: users.length })
}
