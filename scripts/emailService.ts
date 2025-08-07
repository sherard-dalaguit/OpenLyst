import sgMail from '@sendgrid/mail'
import Job from "@/database/job.model";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export interface JobDigestItem {
  title: string;
  companyName: string;
  sourceLink: string;
}

export async function gatherNewJobs(
  since: Date,
  categories: string[]
): Promise<JobDigestItem[]> {
  const jobs = await Job.find({
    postedAt: {$gt: since},
    category: {$in: categories}
  })
  console.log(`Found ${jobs.length} new jobs since ${since.toISOString()}`)

  return jobs.map(item => ({
    title: item.title,
    companyName: item.companyName,
    sourceLink: item.sourceLink,
  }))
}

/**
 * Sends a digest email.
 * @param to                recipient email
 * @param name              recipient name (for personalization)
 * @param jobs              list of jobs to include
 * @param unsubscribeToken  to build the “unsubscribe” link
 * @param type              'daily' | 'weekly'
 */
export async function sendJobDigestEmail(
  to: string,
  name: string,
  jobs: JobDigestItem[],
  unsubscribeToken: string,
  type: 'daily' | 'weekly'
) {
  if (jobs.length === 0) return

  const subject =
    type === 'daily'
      ? `${jobs.length} New Remote Jobs Posted Today! 🏝️🌍🧑‍💻`
      : `${jobs.length} New Remote Jobs Posted This Week! 🏝️🌍🧑‍💻`

  const jobItemsHtml = jobs
    .map(
      (j) =>
        `<p style="margin:0 0 8px;"><strong>${j.companyName}: </strong><a href="${j.sourceLink}" target="_blank">${j.title}</a></p>`
    )
    .join('\n')

  const html = `
    <p style="margin:0 0 16px;">Hey ${name},</p>
    <p style="margin:0 0 16px;">Here are your ${type} remote job matches:</p>
    <p style="margin:0 0 24px;">
      ${jobItemsHtml}
    </p>
    <p style="margin:0 0 16px;">
      <a href="${process.env.SITE_URL}/api/unsubscribe/${unsubscribeToken}">
        Unsubscribe
      </a>
    </p>
  `

  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM!,
    subject,
    html
  })
}
