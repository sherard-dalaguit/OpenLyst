// scrapeJavascriptJobs.ts
import { chromium, BrowserContext } from "playwright";
import Source from "@/database/source.model";
import Job from "@/database/job.model";
import { mapToBroadCategory, mapToJobType } from "@/lib/utils";

export async function scrapeJavascriptJobs(): Promise<number> {
  // 1) load your Source doc
  const source = await Source.findOne({ name: "JavascriptJobs" });
  if (!source) throw new Error("Missing Source document for JavascriptJobs");

  // 2) spin up Playwright
  const browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
  });
  const page = await context.newPage();

  // 3) go to the listings and wait for JS-rendered links
  await page.goto("https://javascript.jobs/remote", { waitUntil: "networkidle" });
  await page.waitForSelector('a[href*="/job/"]', { timeout: 5000 });

  // 4) grab all anchors whose href contains "/job/"
  const links: string[] = await page.$$eval("a", els =>
    els
      .map(a => (a as HTMLAnchorElement).href)
      .filter(href => href.includes("/job/"))
  );

  console.log("found job links:", links.length);

  let count = 0;

  // 5) iterate each detail page
  for (const link of links) {
    try {
      await page.goto(link, { waitUntil: "networkidle" });

      // pull full visible text and split into lines
      const bodyText: string = await page.evaluate(() => document.body.innerText);
      const lines = bodyText
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

      // --- DESCRIPTION: everything between "Apply Now" and "Location" ---
      const applyIdx = lines.findIndex(l => l.startsWith("Apply Now"));
      const locHeadingIdx = lines.findIndex(l =>
        /^Location$/i.test(l) || l.startsWith("Location")
      );
      const description =
        applyIdx >= 0 && locHeadingIdx > applyIdx
          ? lines.slice(applyIdx + 1, locHeadingIdx).join("\n\n")
          : "";

      // --- TITLE: from the page <title> ---
      const fullTitle = await page.title();
      const title = fullTitle.split(" – ")[0].trim();

      // --- COMPANY: first "at XYZ" line ---
      const companyLine = lines.find(l => l.startsWith("at "));
      const companyName = companyLine ? companyLine.replace(/^at\s*/, "") : "";

      // --- LOCATION: first <li> containing "Location" text, or next line after heading ---
      let location = "Remote";
      if (locHeadingIdx >= 0 && locHeadingIdx + 1 < lines.length) {
        location = lines[locHeadingIdx + 1].trim() || "Remote";
      }

      // --- POSTED AT: parse the "Job Posted:" relative time ---
      let postedAt = new Date();
      const postedLine = lines.find(l => /posted/i.test(l));
      if (postedLine) {
        // strip "Posted on", "Job Posted:", etc.
        const datePart = postedLine.replace(/posted(\s*on|:)?\s*/i, "");
        const abs = Date.parse(datePart);
        if (!isNaN(abs)) {
          postedAt = new Date(abs);
        } else {
          // handle "X months/weeks/days ago"
          let m: RegExpExecArray | null;
          const now = new Date();
          if ((m = /(\d+)\s*month/.exec(datePart))) {
            now.setMonth(now.getMonth() - parseInt(m[1], 10));
            postedAt = now;
          } else if ((m = /(\d+)\s*week/.exec(datePart))) {
            now.setDate(now.getDate() - parseInt(m[1], 10) * 7);
            postedAt = now;
          } else if ((m = /(\d+)\s*day/.exec(datePart))) {
            now.setDate(now.getDate() - parseInt(m[1], 10));
            postedAt = now;
          } else if (/today/i.test(datePart)) {
            postedAt = new Date();
          } else if (/yesterday/i.test(datePart)) {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            postedAt = d;
          }
        }
      }

      // --- TAGS: any elements with .tags .tag ---
      let tags: string[] = [];
      try {
        tags = await page.$$eval(".tags .tag", els =>
          els.map(t => t.textContent?.trim() || "")
        );
      } catch {
        tags = [];
      }

      // build job object
      const job = {
        sourceJobId: link.split("/").pop(),
        title,
        companyName,
        location,
        category: mapToBroadCategory(title, tags),
        description,
        salaryMin: undefined as number | undefined,
        salaryMax: undefined as number | undefined,
        postedAt,
        fetchedAt: new Date(),
        jobType: mapToJobType(tags),
        sourceId: source._id,
        sourceLink: link,
        sourceName: "JavascriptJobs",
      };

      // upsert into Mongo
      await Job.findOneAndUpdate(
        { sourceId: job.sourceId, sourceJobId: job.sourceJobId },
        job,
        { upsert: true, setDefaultsOnInsert: true }
      );

      count++;
    } catch (e) {
      console.warn("Failed to scrape", link, e);
    }
  }

  await browser.close();
  return count;
}
