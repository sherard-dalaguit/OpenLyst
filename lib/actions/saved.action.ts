"use server";

import action from "@/lib/handlers/action";
import {SavedJobSchema} from "@/lib/validations";
import handleError from "../handlers/error";
import Job from "@/database/job.model";
import SavedJob from "@/database/saved-job.model";
import {revalidatePath} from "next/cache";
import ROUTES from "@/constants/routes";

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