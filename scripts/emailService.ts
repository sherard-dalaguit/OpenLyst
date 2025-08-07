import sgMail from '@sendgrid/mail'
import Job from "@/database/job.model";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export interface JobDigestItem {
  title: string;
  companyName: string;
  sourceLink: string;
	category: string;
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
		category: item.category || 'Other'
  }))
}

const CATEGORY_ORDER = [
  'Software Engineering',
  'Data',
  'Product Management',
  'Design',
  'DevOps',
  'Marketing',
  'Sales',
  'Customer Support',
  'Quality Assurance',
  'Operations',
  'Other'
]

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

	const orderedCategories = CATEGORY_ORDER.filter(cat =>
    jobs.some(j => j.category === cat)
  )

  let sectionsHtml = ''
  for (const cat of orderedCategories) {
    const items = jobs.filter(j => j.category === cat)
    sectionsHtml += `
      <div style="margin:24px 0;">
        <h2 style="font-size:20px; margin:0 0 8px; color:#2c3e50;">${cat}</h2>
        ${items
          .map(
            j => `
              <p style="margin:4px 0;">
                <strong>${j.companyName}:</strong>
                <a href="${j.sourceLink}" target="_blank">${j.title}</a>
              </p>
            `
          )
          .join('')}
      </div>
    `
  }

  const html = `
		<p style="margin:0 0 16px; font-size:16px;">Hey ${name},</p>
		<p style="margin:0 0 16px; font-size:16px;">
			Here are your ${type} remote job matches:
		</p>
		${sectionsHtml}
		<p style="margin:24px 0 16px; font-size:14px;">
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
