import sgMail from '@sendgrid/mail'
import Job from "@/database/job.model";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export interface JobDigestItem {
  title: string;
  company: string;
  url: string;
}

export async function gatherNewJobs(
  since: Date,
  categories: string[]
): Promise<JobDigestItem[]> {
  const jobs = await Job.find({
    postedAt: {$gt: since},
    category: {$in: categories}
  })

  return jobs.map(item => ({
    title: item.title,
    company: item.company,
    url: item.url,
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
      ? 'Your Daily Remote Jobs Digest 🌐'
      : 'Your Weekly Remote Jobs Digest 🌐'

  const jobItemsHtml = jobs
    .map(
      (j) =>
        `<li><a href="${j.url}" target="_blank">${j.title} @ ${j.company}</a></li>`
    )
    .join('\n')

  const html = `
    <p>Hey ${name},</p>
    <p>Here are your ${type} remote job matches:</p>
    <ul>
      ${jobItemsHtml}
    </ul>
    <p><a href="${process.env.SITE_URL}/api/unsubscribe/${unsubscribeToken}">
      Unsubscribe
    </a></p>
  `

  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM!,
    subject,
    html
  })
}
