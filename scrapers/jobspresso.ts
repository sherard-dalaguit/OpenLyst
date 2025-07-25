import axios from "axios";
import { chromium } from "playwright";
import * as cheerio from "cheerio";
import Source from "@/database/source.model";
import Job from "@/database/job.model";
import { mapToBroadCategory, mapToJobType } from "@/lib/utils";

export async function scrapeJobspresso(): Promise<number> {
  const source = await Source.findOne({ name: "Jobspresso" });
  if (!source) throw new Error("Missing Source document for Jobspresso");

  // load just the first page of listings
  const browser = await chromium.launch();
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  });
  await page.goto("https://jobspresso.co/remote-work/", {
    waitUntil: "networkidle",
  });

  // grab the 30 newest job links
  const rawHrefs: string[] = await page.$$eval(
    'a[href*="/job/"]',
    (els) =>
      Array.from(
        new Set(
          els.map((a) => {
            const href = a.getAttribute("href")!;
            return href.startsWith("http")
              ? href
              : `https://jobspresso.co${href}`;
          })
        )
      )
  );
  await browser.close();

  let count = 0;
  for (const link of rawHrefs) {
    try {
      // fetch the detail page
      const { data: html } = await axios.get(link, {
        headers: { "User-Agent": "RemoteRadarBot/1.0" },
      });
      const $ = cheerio.load(html);

      // --- LOCATION EXTRACTION ---
      let location = "Remote";

      // 1) try JSON-LD JobPosting
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const obj = JSON.parse($(el).html()!);
          const job = Array.isArray(obj)
            ? obj.find((o: any) => o["@type"] === "JobPosting")
            : obj["@type"] === "JobPosting"
            ? obj
            : null;
          if (job?.jobLocation?.address?.addressLocality) {
            location = job.jobLocation.address.addressLocality;
            return false; // break out
          }
        } catch {}
      });

      // 2) fallback: look for a “Location:” line in the HTML
      if (location === "Remote") {
        $('li, p, div').each((_, el) => {
          const txt = $(el).text().trim();
          const m = txt.match(/^(Location|Based in|Office location)[:\s–-]+(.+)$/i);
          if (m) {
            location = m[2].trim();
            return false;
          }
        });
      }

      // --- DATE EXTRACTION (JSON-LD) ---
      let postedAt = new Date();
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const obj = JSON.parse($(el).html()!);
          const job = Array.isArray(obj)
            ? obj.find((o: any) => o["@type"] === "JobPosting")
            : obj["@type"] === "JobPosting"
            ? obj
            : null;
          if (job?.datePosted) {
            postedAt = new Date(job.datePosted);
            return false;
          }
        } catch {}
      });

      // --- SALARY EXTRACTION (optional) ---
      let salaryMin: number | undefined, salaryMax: number | undefined;
      const descText = $("div.job-description").text() || "";
      const range = descText.match(/\$([\d,]+)\s*(?:-|to|–)\s*\$([\d,]+)/);
      if (range) {
        salaryMin = +range[1].replace(/,/g, "");
        salaryMax = +range[2].replace(/,/g, "");
      } else {
        const single = descText.match(/\$([\d,]+)(?:\/hr|\s*per year)?/);
        if (single) salaryMin = salaryMax = +single[1].replace(/,/g, "");
      }

      // --- TITLE & COMPANY & DESCRIPTION ---
      const title = $("h1").first().text().trim();
      const companyName =
        $('a[href*="/company/"]').first().text().trim() ||
        $("div.company-name").text().trim() ||
        "";
      const description =
        $("div.job-description").html() ||
        $("article").first().html() ||
        "";

      // upsert into Mongo
      await Job.findOneAndUpdate(
        { sourceId: source._id, sourceJobId: link },
        {
          sourceJobId: link,
          title,
          companyName,
          location,
          category: mapToBroadCategory(title, []),
          description,
          salaryMin,
          salaryMax,
          postedAt,
          fetchedAt: new Date(),
          jobType: mapToJobType([]),
          sourceId: source._id,
          sourceLink: link,
          sourceName: "Jobspresso",
        },
        { upsert: true, setDefaultsOnInsert: true }
      );

      count++;
    } catch (err) {
      console.warn(`Jobspresso scrape failed for ${link}:`, err);
    }
  }

  return count;
}
