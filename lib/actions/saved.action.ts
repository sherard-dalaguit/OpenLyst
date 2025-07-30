"use server";

import action from "@/lib/handlers/action";
import {SavedJobSchema, JobSearchParamsSchema} from "@/lib/validations";
import handleError from "../handlers/error";
import Job from "@/database/job.model";
import SavedJob from "@/database/saved-job.model";
import {revalidatePath} from "next/cache";
import ROUTES from "@/constants/routes";
import mongoose, {PipelineStage} from "mongoose";
import {slugToLabel} from "@/lib/utils";

export async function toggleSaveJob(params: SavedJobParams): Promise<ActionResponse<{saved: boolean}>> {
	const validationResult = await action({
		params,
		schema: SavedJobSchema,
		authorize: true,
	});
	
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { jobId } = validationResult.params!;
	const userId = validationResult.session?.user?.id;

	try {
		const job = await Job.findById(jobId);
		if (!job) throw new Error("Job not found");

		const savedJob = await SavedJob.findOne({ user: userId, job: jobId });

		if (savedJob) {
			await SavedJob.findByIdAndDelete(savedJob._id);

			revalidatePath(ROUTES.SAVED_JOBS);
			return { success: true, data: { saved: false } };
		}

		await SavedJob.create({ user: userId, job: jobId });

		revalidatePath(ROUTES.SAVED_JOBS);
		return { success: true, data: { saved: true } };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function hasSavedJob(params: SavedJobParams): Promise<ActionResponse<{saved: boolean}>> {
	const validationResult = await action({
		params,
		schema: SavedJobSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { jobId } = validationResult.params!;
	const userId = validationResult.session?.user?.id;

	try {
		const savedJob = await SavedJob.findOne({ user: userId, job: jobId });

		return { success: true, data: { saved: !!savedJob } };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function getSavedJobs(params: JobSearchParams): Promise<ActionResponse<{ collection: SaveJobType[], isNext: boolean}>> {
	const validationResult = await action({
		params,
		schema: JobSearchParamsSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const userId = validationResult.session?.user?.id;
	const { page = 1, pageSize = 40, query, jobType, experienceLevel, category, source, salary, datePosted, sort } = params;

	const split = (s?: string) => s?.split(",").filter(Boolean) ?? [];
	const types = split(jobType);
	const levels = split(experienceLevel);
	const cats = split(category);
	const sources = split(source);
	const skip = (Number(page) - 1) * Number(pageSize);
	const limit = Number(pageSize);

	try {
		const pipeline: PipelineStage[] = [
			{ $match: { user: new mongoose.Types.ObjectId(userId) } },
			{
				$lookup: {
					from: "jobs",
					localField: 'job',
					foreignField: '_id',
					as: 'job',
				}
			},
			{ $unwind: "$job" },
		];

		if (types.length) {
			pipeline.push({
				$match: {
					"job.jobType": {
						$in: types.map((s) => slugToLabel(s, "-")),
					},
				},
			});
		}
		if (levels.length) {
			pipeline.push({
				$match: { "job.experienceLevel": { $in: levels } },
			});
		}
		if (cats.length) {
			pipeline.push({
				$match: {
					"job.category": {
						$in: cats.map((s) => slugToLabel(s, " ")),
					},
				},
			});
		}
		if (sources.length) {
			pipeline.push({
				$match: {
					"job.sourceName": {
						$in: sources.map((s) => slugToLabel(s, " ")),
					},
				},
			});
		}
		if (salary != null) {
			pipeline.push({
				$match: { "job.salaryMin": { $gte: salary } },
			});
		}
		if (datePosted !== "anytime") {
			const now = Date.now();
			const hoursMap = {
				"24h": 24,
				"3d": 72,
				"7d": 168,
				"14d": 336,
				"30d": 720,
				"60d": 1440,
				"90d": 2160,
			};
			const agoMs = (hoursMap[datePosted as keyof typeof hoursMap] ?? 0) * 60 * 60 * 1000;
			pipeline.push({
				$match: { "job.postedAt": { $gte: new Date(now - agoMs) } },
			});
		}

		if (query) {
			pipeline.push({
				$addFields: {
					score: {
						$add: [
							{ $cond: [ { $regexMatch: { input: "$job.title", regex: query, options: "i" } }, 5, 0 ] },
							{ $cond: [ { $regexMatch: { input: "$job.companyName", regex: query, options: "i" } }, 3, 0 ] },
							{ $cond: [ { $regexMatch: { input: "$job.category", regex: query, options: "i" } }, 2, 0 ] },
							{ $cond: [ { $regexMatch: { input: "$job.description", regex: query, options: "i" } }, 1, 0 ] },
						],
					},
				},
			});
    	pipeline.push({ $match: { score: { $gt: 0 } } });
  	}

		let sortStage: Record<string, 1 | -1>;
		if (query) {
			if (sort === "oldest") {
				sortStage = { "job.postedAt": 1 };
			} else if (sort === "newest") {
				sortStage = { "job.postedAt": -1 };
			} else {
				sortStage = { score: -1, "job.postedAt": -1 };
			}
		} else {
			sortStage =
				sort === "oldest"
					? { "job.postedAt": 1 }
					: { "job.postedAt": -1 };
		}

		pipeline.push(
			{ $sort: sortStage },
			{ $skip: skip },
			{ $limit: limit },
		)

		const countAgg = await SavedJob.aggregate([
			...pipeline, { $count: "count" },
		]).collation({ locale: "en", strength: 2 });
		const totalCount = countAgg[0]?.count ?? 0;

		const jobs = await SavedJob.aggregate(pipeline).collation({ locale: "en", strength: 2 });
		const isNext = totalCount.count > skip + jobs.length;

		return { success: true, data: { collection: JSON.parse(JSON.stringify(jobs)), isNext } };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}