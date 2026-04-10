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

const RSS_FEEDS = [
  // "https://weworkremotely.com/remote-jobs.rss",
  "https://weworkremotely.com/categories/remote-product-jobs.rss",
  "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss",
  "https://weworkremotely.com/categories/remote-management-and-finance-jobs.rss",
  "https://weworkremotely.com/categories/remote-design-jobs.rss",
  "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
  "https://weworkremotely.com/categories/all-other-remote-jobs.rss",
];

export async function scrapeWeWorkRemotely(): Promise<number> {
  // 1. Mongo Source doc
  const source = await Source.findOne({ name: "WeWorkRemotely" });
  if (!source) throw new Error("Missing Source document for We Work Remotely");

  // 2. Launch Playwright once
  const browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  });

  // 3. Prepare RSS parser
  const parser = new Parser<{}, WWRItem>();

  let totalCount = 0;

  // 4. For each feed URL…
  for (const rssUrl of RSS_FEEDS) {
    console.log(`Fetching RSS feed: ${rssUrl}`);
    const feedPage = await context.newPage();
    const resp = await feedPage.goto(rssUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    if (!resp || resp.status() !== 200) {
      console.warn(`⚠️  Could not load RSS feed ${rssUrl}: ${resp?.status()}`);
      await feedPage.close();
      continue;
    }
    const xml = await resp.text();
    await feedPage.close();

    // 5. Parse that feed’s items
    const feed = await parser.parseString(xml);

    // 6. Upsert each job in that feed
    for (const item of feed.items) {
      console.log(item)
      const link = item.link?.trim();
      if (!link) continue;

      const sourceJobId = item.guid || link;
      const rawTitle = item.title || "";
      // split “Company: Position” or fallback
      let [companyName, position] = rawTitle.split(": ").map((s) => s.trim());
      if (!position) {
        // maybe it was “Position at Company”
        [position, companyName] = rawTitle.split(" at ").map((s) => s.trim());
      }
      if (!companyName) companyName = item.creator || "";

      const description = item.content || "";
      const snippet = item.contentSnippet?.trim() || "";

      // pull HQ or default “Remote”
      const hqMatch = description.match(
        /<strong>Headquarters:<\/strong>\s*([^<\r\n]+)/
      );
      const location = hqMatch ? hqMatch[1].trim() : "Remote";

      // posted date
      const dateString = item.pubDate || item.isoDate;
      const postedAt = dateString ? new Date(dateString) : new Date();

      // ** detail‐page salary extraction ** (optional, same as before )
      let salaryMin: number | undefined;
      let salaryMax: number | undefined;
      const detailPage = await context.newPage();
      try {
        await detailPage.goto(link, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        const salaryText = await detailPage.evaluate(() => {
          const li = Array.from(document.querySelectorAll("li")).find((el) =>
            el.textContent?.trim().startsWith("Salary")
          );
          return li
            ? li.textContent!.replace(/^Salary[:\s]*/, "").trim()
            : null;
        });
        if (salaryText) {
          const m = salaryText.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
          if (m) {
            salaryMin = Number(m[1].replace(/,/g, ""));
            salaryMax = Number(m[2].replace(/,/g, ""));
          }
        }
      } catch (e) {
        console.warn(`Could not fetch salary for ${link}`, e);
      }
      await detailPage.close();

      // upsert
      await Job.findOneAndUpdate(
        { sourceId: source._id, sourceJobId },
        {
          $set: {
            title: position,
            companyName,
            location,
            category: mapToBroadCategory(position, item.categories || []),
            description,
            snippet,
            salaryMin,
            salaryMax,
            fetchedAt: new Date(),
            jobType: mapToJobType(item.categories || []),
            sourceId: source._id,
            sourceLink: link,
            sourceName: "WeWorkRemotely",
          },
          $setOnInsert: {
            sourceJobId,
            postedAt,
          },
        },
        { upsert: true }
      );

      totalCount++;
    }
  }

  await browser.close();
  return totalCount;
}
