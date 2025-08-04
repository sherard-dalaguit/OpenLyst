import { NextResponse } from 'next/server'
import dbConnect from "@/lib/mongoose";
import User from '@/database/user.model';
import {gatherNewJobs, sendJobDigestEmail} from "@/scripts/emailService";

export async function GET() {
  await dbConnect()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const users = await User.find({
    'preferences.receiveAlerts': true,
    'preferences.frequency': 'daily',
    $or: [
      { 'preferences.lastSentAt': { $lt: since } },
      { 'preferences.lastSentAt': { $exists: false } }
    ]
  }).lean()

  for (const u of users) {
    const jobs = await gatherNewJobs(since, u.preferences.categories)
    await sendJobDigestEmail(
      u.email,
      u.name || 'there',
      jobs,
      u.preferences.unsubscribeToken,
      'daily'
    )
    await User.findByIdAndUpdate(u._id, {
      'preferences.lastSentAt': new Date()
    })
  }

  return NextResponse.json({ status: 'ok', sent: users.length })
}
