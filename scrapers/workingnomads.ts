import axios from "axios";
import Source from "@/database/source.model";
import Job from "@/database/job.model";
import { mapToBroadCategory, mapToJobType } from "@/lib/utils";

export async function scrapeWorkingNomads(): Promise<number> {
  // 1) load your Source doc
  const source = await Source.findOne({ name: "WorkingNomads" });
  if (!source) throw new Error("Missing Source document for Working Nomads");

  // 2) hit their Elastic index directly
  //    these vars come straight from their page’s <script> tags:
  const elasticRootUrl = "https://www.workingnomads.com";
  const elasticIndex   = "jobsapi";

  // 3) request all jobs (size can be bumped if you need more)
  const esUrl = `${elasticRootUrl}/${elasticIndex}/_search`;
  const { data: esResp } = await axios.post(esUrl, {
    size: 1000,
		sort: [
			{ pub_date: { order: "desc" } }, // newest first
			{ id: { order: "desc" } } // tiebreaker for stable ordering
		],
    query: { match_all: {} }
  });

  // 4) pull out the raw job docs
  //    (every hit._source is one job object)
  const jobsArray: any[] =
    esResp.hits && Array.isArray(esResp.hits.hits)
      ? esResp.hits.hits.map((h: any) => h._source)
      : [];

  let count = 0;
  for (const raw of jobsArray) {
    if (raw.expired) continue;

    // 5) map fields from the _source
    const sourceJobId  = raw.id?.toString() || raw.slug || raw.url;
    const title = raw.title || raw.position || "";
    const companyName  = raw.company || raw.company_name || "";

    const location = Array.isArray(raw.locations) && raw.locations.length > 0
    ? raw.locations.join(", ")
    : raw.location_base
      ? raw.location_base + (raw.location_extra ? ` (${raw.location_extra})` : "")
      : "Remote";

    const sourceLink = raw.apply_url || raw.link || "";
    const postedAt = raw.pub_date
      ? new Date(raw.pub_date)
      : raw.published_at
      ? new Date(raw.published_at)
      : new Date();

    const description  = raw.description || raw.body || "";

    // 6) salary parsing (if present)
    let salaryMin: number|undefined;
    let salaryMax: number|undefined;
    if (typeof raw.salary_range === "string") {
      const m = raw.salary_range
        .replace(/k/gi, "000")         // "230k" → "230000"
        .match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
      if (m) {
        salaryMin = Number(m[1].replace(/,/g, ""));
        salaryMax = Number(m[2].replace(/,/g, ""));
      }
    }
    // fallback if salary_range isn’t present but annual_salary_usd is:
    if (!salaryMin && raw.annual_salary_usd) {
      salaryMax = raw.annual_salary_usd;
    }

    // 7) derive category & jobType from tags/categories
    // category_name (e.g. "Development", "Design") is prepended so it acts as
    // an extra scoring signal without bypassing our taxonomy normalization
    const tags     = Array.isArray(raw.tags) ? raw.tags : raw.all_tags || [];
    const categoryHints = raw.category_name ? [raw.category_name, ...tags] : tags;
    const category = mapToBroadCategory(title, categoryHints);
    const jobType  = mapToJobType(categoryHints);

    // 8) upsert into Mongo
    await Job.findOneAndUpdate(
      { sourceId: source._id, sourceJobId },
      {
        $set: {
          title,
          companyName,
          location,
          category,
          description,
          salaryMin,
          salaryMax,
          fetchedAt: new Date(),
          jobType,
          sourceId: source._id,
          sourceLink,
          sourceName: "WorkingNomads",
        },
        $setOnInsert: {
          sourceJobId,
          postedAt,
        },
      },
      { upsert: true }
    );

    count++;
  }

  return count;
}
