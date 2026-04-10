import {mapToBroadCategory, mapToJobType} from "@/lib/utils";
import Source from "@/database/source.model";
import Job from "@/database/job.model";
import axios from "axios";
import pLimit from "p-limit";

export async function scrapeRemoteOK(): Promise<number> {
  const { data } = await axios.get("https://remoteok.com/api");

  const source = await Source.findOne({ name: "RemoteOK" });
  if (!source) throw new Error("Missing Source document for RemoteOK");

  const limit = pLimit(5); // max 5 concurrent detail requests
  let count = 0;

  await Promise.all(
    data
      .filter((j: any) => j.id && !j.is_company_page)
      .map((raw: any) =>
        limit(async () => {
          const url =
            raw.url.startsWith("http")
              ? raw.url
              : `https://remoteok.com${raw.url}`;

          console.log(raw)

          const tags: string[] = Array.isArray(raw.tags)
            ? raw.tags
            : [];

          await Job.findOneAndUpdate(
            { sourceId: source._id, sourceJobId: raw.id.toString() },
            {
              $set: {
                title: raw.position,
                companyName: raw.company,
                location: raw.location || "Remote",
                category: mapToBroadCategory(raw.position, tags),
                description: raw.description || "",
                salaryMin: raw.salary_min,
                salaryMax: raw.salary_max,
                fetchedAt: new Date(),
                jobType: mapToJobType(tags),
                sourceId: source._id,
                sourceLink: url,
                sourceName: "RemoteOk",
              },
              $setOnInsert: {
                sourceJobId: raw.id.toString(),
                postedAt: new Date(raw.date),
              },
            },
            { upsert: true }
          );
          count++;
        })
      )
  );

  return count;
}
