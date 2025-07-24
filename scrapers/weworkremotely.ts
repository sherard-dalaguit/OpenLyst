import { chromium, BrowserContext } from "playwright";
import Parser from "rss-parser";
import Source from "@/database/source.model";
import Job from "@/database/job.model";
import { mapToBroadCategory, mapToJobType } from "@/lib/utils";

type WWRItem = {
  title: string;
  link: string;
  guid: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  categories?: string[];
  creator?: string;
};

export async function scrapeWeWorkRemotely(): Promise<number> {
  // 1) load your Source doc
  const source = await Source.findOne({ name: "We Work Remotely" });
  if (!source) throw new Error("Missing Source document for We Work Remotely");

  // 2) solve CF JS challenge with Playwright
  const browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  const rssUrl = "https://weworkremotely.com/remote-jobs.rss";
  const response = await page.goto(rssUrl, { waitUntil: "networkidle" });
  if (!response || response.status() !== 200) {
    await browser.close();
    throw new Error(`Failed to load RSS: ${response?.status()}`);
  }
  const rssXml = await response.text();

  // 3) parse the RSS
  const parser = new Parser<{}, WWRItem>();
  const feed = await parser.parseString(rssXml);

  // 4) upsert each item
  let count = 0;
  for (const item of feed.items) {
    const link = item.link?.trim();
    if (!link) continue;

    console.log(item)

    const sourceJobId = item.guid || link;
    const rawTitle = item.title || "";
    let [companyName, position] = rawTitle.split(": ").map((s) => s.trim());
    if (!companyName) companyName = item.creator || "";

    // full HTML description
    const description = item.content || "";

    // extract Headquarters location if present
    const hqMatch = description.match( /<strong>Headquarters:<\/strong>\s*([^<\r\n]+)/ );
    const location = hqMatch ? hqMatch[1].trim() : "Remote";

    // use pubDate or isoDate
    const dateString = item.pubDate || item.isoDate;
    const postedAt = dateString ? new Date(dateString) : new Date();

    // navigate to detail page and pull salary
    const detailPage = await context.newPage();
    let salaryText: string | null = null;
    try {
      await detailPage.goto(link, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      salaryText = await detailPage.evaluate(() => {
        const li = Array.from(document.querySelectorAll("li"))
          .find((el) => el.textContent?.trim().startsWith("Salary"));
        return li ? li.textContent!.replace(/^Salary[:\s]*/, "").trim() : null;
      });
    } catch (e) {
      console.warn(`Could not load detail page for salary: ${link}`, e);
    }
    await detailPage.close();

    // parse out min/max if available
    let salaryMin: number | undefined;
    let salaryMax: number | undefined;
    if (salaryText) {
      const match = salaryText.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
      if (match) {
        salaryMin = Number(match[1].replace(/,/g, ""));
        salaryMax = Number(match[2].replace(/,/g, ""));
      }
    }

    await Job.findOneAndUpdate(
      { sourceId: source._id, sourceJobId },
      {
        sourceJobId,
        title: position,
        companyName,
        location,
        category: mapToBroadCategory(position, item.categories || []),
        description,
        salaryMin,
        salaryMax,
        postedAt,
        jobType: mapToJobType(item.categories || []),
        sourceId: source._id,
        sourceLink: link,
        sourceName: "We Work Remotely",
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    count++;
  }

  await browser.close();
  return count;
}
