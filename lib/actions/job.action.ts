"use server";

import Job from "@/database/job.model";
import action from "@/lib/handlers/action";
import {JobSearchParamsSchema, GetJobSchema} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import {FilterQuery} from "mongoose";
import {slugToLabel} from "@/lib/utils";

type JobSearchParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  jobType?: string;
  experienceLevel?: string;
  category?: string;
	source?: string;
  salary?: number;
  datePosted?: string;
  sort?: string;
};

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

	let sortCriteria = {};

	switch (sort) {
		case 'newest':
			sortCriteria = { postedAt: -1 };
			break;
		case 'oldest':
			sortCriteria = { postedAt: 1 };
			break;
		default:
			sortCriteria = { postedAt: -1 };
			break;
	}

	if (query) {
		pipeline.push({
			$addFields: {
				score: {
					$add: [
						{
							// +5 if title matches
							$cond: [
								{ $regexMatch: { input: "$title", regex: query, options: "i" } },
								5,
								0
							]
						},
						{
							// +3 if companyName matches
							$cond: [
								{ $regexMatch: { input: "$companyName", regex: query, options: "i" } },
								3,
								0
							]
						},
						{
							// +2 if category matches
							$cond: [
								{ $regexMatch: { input: "$category", regex: query, options: "i" } },
								2,
								0
							]
						},
						{
							// +1 if description matches
							$cond: [
								{ $regexMatch: { input: "$description", regex: query, options: "i" } },
								1,
								0
							]
						},
					]
				}
			}
		});
		// drop results with zero score
		pipeline.push({ $match: { score: { $gt: 0 } } });
		// sort by that score
		pipeline.push({ $sort: { score: -1, createdAt: -1 } });
	} else {
		// no search: use your normal sort
		pipeline.push({ $sort: sortCriteria });
	}

	try {
		const totalJobs = await Job.countDocuments(filterQuery);

		const jobs = await Job.aggregate([
			...pipeline,
			{ $skip: skip },
			{ $limit: limit },
		]).collation({ locale: 'en', strength: 2 });

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