import axios from "axios";
import Source from "@/database/source.model";
import Job from "@/database/job.model";
import { mapToBroadCategory, mapToJobType } from "@/lib/utils";

export async function scrapeRemotive(): Promise<number> {
  // 1) load your Source doc
  const source = await Source.findOne({ name: "Remotive" });
  if (!source) throw new Error("Missing Source document for Remotive");

  // 2) hit the public API
  const { data } = await axios.get("https://remotive.com/api/remote-jobs");
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];
  let count = 0;

  // 3) upsert each job
  for (const raw of jobs) {
    console.log(raw);

    const sourceJobId = raw.id.toString();
    const title = raw.title;
    const companyName = raw.company_name;
    const location = raw.candidate_required_location || "Worldwide";
    const category = mapToBroadCategory(title, [raw.category]);
    const description = raw.description || "";
    const postedAt = raw.publication_date ? new Date(raw.publication_date) : new Date();

    // 4) parse salary string
    let salaryMin: number | undefined;
    let salaryMax: number | undefined;
    if (raw.salary) {
      const m = raw.salary.match(/\$([\d,]+)\s*(?:-|to)\s*\$([\d,]+)/i);
      if (m) {
        salaryMin = Number(m[1].replace(/,/g, ""));
        salaryMax = Number(m[2].replace(/,/g, ""));
      }
    }

    // 5) map job type
    const jobType = mapToJobType(raw.job_type ? [raw.job_type] : []);

    await Job.findOneAndUpdate(
      { sourceId: source._id, sourceJobId },
      {
        sourceJobId,
        title,
        companyName,
        location,
        category,
        description,
        salaryMin,
        salaryMax,
        postedAt,
        fetchedAt: new Date(),
        jobType,
        sourceId: source._id,
        sourceLink: raw.url,
        sourceName: "Remotive",
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
    count++;
  }

  return count;
}