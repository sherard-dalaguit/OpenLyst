import { NextResponse } from 'next/server'
import dbConnect from "@/lib/mongoose";
import User from '@/database/user.model';
import {gatherNewJobs, sendJobDigestEmail} from "@/scripts/emailService";

export async function GET() {
  console.log('[cron/weekly] -> handler hit')
  await dbConnect()

	const jobsSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const eligibilitySince = new Date(Date.now() - ((7 * 24 - 1) * 60 * 60 * 1000))

	const users = await User.find({
    'preferences.receiveAlerts': true,
    'preferences.frequency': 'weekly',
    $or: [
      { 'preferences.lastSentAtWeekly': { $lte: eligibilitySince } },
      { 'preferences.lastSentAtWeekly': { $exists: false } }
    ]
  }).lean()
  console.log(`[cron/weekly] Found ${users.length} users to email`)

  for (const u of users) {
    console.log(`[cron/weekly] → processing ${u.email}`)
    const jobs = await gatherNewJobs(jobsSince, u.preferences.categories)
    console.log(`  • ${jobs.length} new jobs`)

    try {
      await sendJobDigestEmail(
        u.email,
        u.name || 'there',
        jobs,
        u.preferences.unsubscribeToken,
        'weekly'
      )
      console.log(`  ✓ Sent email to ${u.email}`)

			await User.findByIdAndUpdate(u._id, {
				'preferences.lastSentAtWeekly': new Date()
			})
    } catch (error) {
      console.error(`  ✗ Error sending to ${u.email}`, error)
    }

  }

  return NextResponse.json({ status: 'ok', sent: users.length })
}
