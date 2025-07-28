import { chromium } from "playwright";
import Source from "@/database/source.model";
import Job from "@/database/job.model";
import { mapToBroadCategory, mapToJobType } from "@/lib/utils";

const BASE = "https://www.skipthedrive.com";
const CATEGORY_SLUGS = [
  "remote-software-development-jobs",
  "remote-customer-service-jobs",
  "remote-marketing-jobs",
  "remote-project-manager-jobs",
  "remote-business-development-jobs",
  "remote-sales-jobs",
  "remote-human-resources-jobs",
  "remote-finance-jobs",
  "remote-healthcare-jobs"
];

export async function scrapeSkipTheDrive(): Promise<number> {
  const source = await Source.findOne({ name: "SkipTheDrive" });
  if (!source) throw new Error("Missing Source document for SkipTheDrive");

  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  let totalCount = 0;

  for (const slug of CATEGORY_SLUGS) {
    const url = `${BASE}/job-category/${slug}/`;
    let listings: { title: string; link: string }[];

    try {
      await page.goto(url, { waitUntil: "networkidle" });

      await page.waitForSelector("h2.entry-title a", { timeout: 5000 });
      listings = await page.$$eval("h2.entry-title a", (els) =>
        els.map((a) => {
          const anchor = a as HTMLAnchorElement;
          const title  = anchor.textContent?.trim() || "";
          const link   = anchor.href;

          return { title, link };
        })
      );

      console.log(listings);
    } catch {
      console.warn(`⚠️  skipping ${slug} (no listings)`);
      continue;
    }

    if (listings.length === 0) {
      console.warn(`⚠️  ${slug} returned 0 links, skipping`);
      continue;
    }

    for (const job of listings) {
      if (!job.link) continue;
      console.log(job)

      const detailPage = await context.newPage();
      await detailPage.goto(job.link, { waitUntil: "domcontentloaded" });

      const title = await detailPage
        .textContent("h1.entry-title")
        .then((t) => t?.trim() ?? job.title);
      const description = await detailPage
        .innerHTML("div.entry-content");

      const location = await detailPage
        .textContent("div.entry-content strong:has-text('Location:') + text()")
        .then((t) => t?.trim() ?? "Remote")
        .catch(() => "Remote");

      const salaryText = await detailPage
        .textContent("div.entry-content strong:has-text('Salary:') + text()")
        .catch(() => "");
      let salaryMin: number | undefined, salaryMax: number | undefined;
      if (salaryText) {
        const nums = salaryText
          .replace(/[^0-9—to\-]/g, "")
          .split(/to|–|\-/)
          .map((s) => parseInt(s.replace(/,/g, ""), 10))
          .filter((n) => !isNaN(n));
        salaryMin = nums[0];
        salaryMax = nums[1] ?? nums[0];
      }

      const rawFirstLine = await detailPage.evaluate(() => {
        const h1 = document.querySelector("h1.entry-title");
        if (!h1) return "";
        let el = h1.nextElementSibling;
        // skip over any blank/text‐only nodes
        while (el && !el.textContent!.trim()) {
          el = el.nextElementSibling;
        }
        return el?.textContent!.trim() || "";
      });

      const parts = rawFirstLine.split(/\s{2,}/).map((s) => s.trim());

      const [companyNameFromDetail] = rawFirstLine.split(/\s{2,}/).map(s => s.trim());
      const datePostedRaw        = parts[1] || "";
      const locationFromDetail   = parts[2] || "Remote";

      const categories = await detailPage
        .$$eval("meta[property='article:tag']", (els) =>
          els.map((e) => (e as any).content as string)
        )
        .catch(() => [] as string[]);
      const mappedCategory = mapToBroadCategory(title, categories);
      const jobType = mapToJobType(categories);

      await detailPage.close();

      await Job.findOneAndUpdate(
        { sourceId: source._id, sourceLink: job.link },
        {
          sourceJobId: job.link,
          title,
          companyName: companyNameFromDetail,
          location: locationFromDetail || location,
          category: mappedCategory,
          description,
          salaryMin,
          salaryMax,
          postedAt: new Date(datePostedRaw),
          fetchedAt: new Date(),
          jobType,
          sourceId: source._id,
          sourceLink: job.link,
          sourceName: "SkipTheDrive",
        },
        { upsert: true, setDefaultsOnInsert: true }
      );

      totalCount++;
    }
  }

  await browser.close();
  return totalCount;
}
