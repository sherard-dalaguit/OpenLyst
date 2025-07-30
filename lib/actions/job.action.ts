"use server";

import Job from "@/database/job.model";
import action from "@/lib/handlers/action";
import {JobSearchParamsSchema, GetJobSchema} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import {FilterQuery} from "mongoose";
import {slugToLabel} from "@/lib/utils";

export async function getJobs(params: JobSearchParams): Promise<ActionResponse<{ jobs: JobType[], isNext: boolean }>> {
	const validationResult = await action({
		params,
		schema: JobSearchParamsSchema,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { page = 1, pageSize = 10, query, jobType, experienceLevel, category, source, salary, datePosted, sort } = params;

	const split = (s?: string) => s?.split(",").filter(Boolean) ?? [];
	const types = split(jobType);
	const levels = split(experienceLevel);
	const cats = split(category);
	const sources = split(source);
	const skip = (Number(page) - 1) * Number(pageSize);
	const limit = Number(pageSize);

	const filterQuery: FilterQuery<typeof Job> = {};

	if (types.length) {
		filterQuery.jobType = { $in: types.map(s => slugToLabel(s, "-")) };
	}
	if (levels.length) filterQuery.experienceLevel = { $in: levels };
	if (cats.length) {
		filterQuery.category = { $in: cats.map(s => slugToLabel(s, " ")) };
	}
	if (sources.length) {
		filterQuery.sourceName = { $in: sources.map(s => slugToLabel(s, " ")) };
	}

	if (salary != null) filterQuery.salaryMin = { $gte: salary };

	if (datePosted !== "anytime") {
		const now = Date.now();
		const hoursMap = { "24h": 24, "3d": 72, "7d": 168, "14d": 336, "30d": 720, "60d": 1440, "90d": 2160 };
		const agoMs = hoursMap[datePosted as keyof typeof hoursMap] * 60*60*1000;
		filterQuery.postedAt = { $gte: new Date(now - agoMs) };
	}

	const pipeline: any[] = [
		{ $match: filterQuery },
	];

	let sortStage: Record<string, 1 | -1>;
	if (query) {
		// if there's a query, choose between date or relevance-based sort
		if (sort === "oldest") {
			// pure date ascending
			sortStage = { postedAt: 1 };
		} else if (sort === "newest") {
			// pure date descending
			sortStage = { postedAt: -1 };
		} else {
			// fallback: relevance first, then newest
			sortStage = { score: -1, postedAt: -1 };
		}
	} else {
		// no query → just date sort
		sortStage = sort === "oldest"
			? { postedAt: 1 }
			: /* newest or default */  { postedAt: -1 };
	}

	if (query) {
		pipeline.push({
			$addFields: {
				score: {
					$add: [
						{ $cond: [ { $regexMatch: { input: "$title",       regex: query, options: "i" } }, 5, 0 ] },
						{ $cond: [ { $regexMatch: { input: "$companyName", regex: query, options: "i" } }, 3, 0 ] },
						{ $cond: [ { $regexMatch: { input: "$category",    regex: query, options: "i" } }, 2, 0 ] },
						{ $cond: [ { $regexMatch: { input: "$description", regex: query, options: "i" } }, 1, 0 ] },
					]
				}
			}
		});
		pipeline.push({ $match: { score: { $gt: 0 } } });
	}

	pipeline.push(
		{ $sort: sortStage },
		{ $skip: skip },
		{ $limit: limit },
	)

	try {
		const totalJobs = await Job.countDocuments(filterQuery);

		const jobs = await Job.aggregate(pipeline).collation({ locale: 'en', strength: 2 });

		const isNext = totalJobs > skip + jobs.length;

		return {
			success: true,
			data: { jobs: JSON.parse(JSON.stringify(jobs)), isNext }
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function getJob(params: GetJobParams): Promise<ActionResponse<JobType>> {
	const validationResult = await action({
		params,
		schema: GetJobSchema,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { jobId } = validationResult.params!;

	try {
		const job = await Job.findById(jobId);

		if (!job) {
			throw new Error("Job not found");
		}

		return { success: true, data: JSON.parse(JSON.stringify(job)) };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}