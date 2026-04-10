import { NextResponse } from 'next/server'
import dbConnect from "@/lib/mongoose";
import Job from '@/database/job.model';
import SavedJob from '@/database/saved-job.model';
import AppliedJob from '@/database/applied-job.model';

export async function GET() {
  console.log('[cron/cleanup] -> handler hit')
  await dbConnect()

  const threeWeeksAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)

  const oldJobs = await Job.find(
    { fetchedAt: { $lt: threeWeeksAgo } },
    { _id: 1 }
  ).lean()

  const jobIds = oldJobs.map((j) => j._id)
  console.log(`[cron/cleanup] Found ${jobIds.length} jobs not seen in 3 weeks`)

  if (jobIds.length === 0) {
    return NextResponse.json({ status: 'ok', deleted: 0 })
  }

  const [savedResult, appliedResult, jobResult] = await Promise.all([
    SavedJob.deleteMany({ job: { $in: jobIds } }),
    AppliedJob.deleteMany({ job: { $in: jobIds } }),
    Job.deleteMany({ _id: { $in: jobIds } }),
  ])

  console.log(`[cron/cleanup] Deleted ${jobResult.deletedCount} jobs, ${savedResult.deletedCount} saved-jobs, ${appliedResult.deletedCount} applied-jobs`)

  return NextResponse.json({
    status: 'ok',
    deleted: {
      jobs: jobResult.deletedCount,
      savedJobs: savedResult.deletedCount,
      appliedJobs: appliedResult.deletedCount,
    },
  })
}