"use server";

import action from "@/lib/handlers/action";
import {AppliedJobSchema} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import Job from "@/database/job.model";
import AppliedJob from "@/database/applied-job.model";
import {revalidatePath} from "next/cache";
import ROUTES from "@/constants/routes";

export async function toggleApplyJob(params: ApplyJobParams): Promise<ActionResponse<{applied: boolean}>> {
	const validationResult = await action({
		params,
		schema: AppliedJobSchema,
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

		const appliedJob = await AppliedJob.findOne({ user: userId, job: jobId });

		if (appliedJob) {
			await AppliedJob.findByIdAndDelete(appliedJob._id);

			revalidatePath(ROUTES.APPLIED_JOBS);
			return { success: true, data: { applied: false } };
		}

		await AppliedJob.create({ user: userId, job: jobId });

		revalidatePath(ROUTES.APPLIED_JOBS);
		return { success: true, data: { applied: true } };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function hasAppliedJob(params: ApplyJobParams): Promise<ActionResponse<{applied: boolean}>> {
	const validationResult = await action({
		params,
		schema: AppliedJobSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { jobId } = validationResult.params!;
	const userId = validationResult.session?.user?.id;

	try {
		const appliedJob = await AppliedJob.findOne({ user: userId, job: jobId });

		return { success: true, data: { applied: !!appliedJob } };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}