"use client"

import { useSession } from "next-auth/react";
import {use, useState} from "react";
import {IconCircleCheckFilled, IconCircleDashedCheck} from "@tabler/icons-react";
import { toast } from "sonner";
import {toggleApplyJob} from "@/lib/actions/applied.action";

const ApplyJob = ({
	jobId,
	hasAppliedJobPromise
}: {
	jobId: string,
	hasAppliedJobPromise: Promise<ActionResponse<{ applied: boolean }>>
}) => {
	const session = useSession();
	const userId = session?.data?.user?.id;

	const { data } = use(hasAppliedJobPromise);

	const { applied: hasApplied } = data || { applied: false };

	const [isLoading, setIsLoading] = useState(false);

	const handleApply = async () => {
		if (isLoading) return;
		if (!userId) return toast.error("Error", {description: "You must be logged in to save your applied jobs."});

		setIsLoading(true);

		try {
			const { success, data, error } = await toggleApplyJob({ jobId });

			if (!success) throw new Error(error?.message || "Failed to apply job");

			toast.success("Success", {description: data?.applied ? "Job successfully added to applied list!" : "Job removed from applied list."});
		} catch (error) {
			toast.error("Error", {description: error instanceof Error ? error.message : "An unexpected error occurred."});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		hasApplied
			? <IconCircleCheckFilled className={`cursor-pointer text-primary-500 transition-all duration-150 hover:scale-110 ${isLoading && 'opacity-50'}`} onClick={handleApply} />
			: <IconCircleDashedCheck className={`cursor-pointer transition-all duration-150 hover:scale-110 hover:text-primary-500 ${isLoading && 'opacity-50'}`} onClick={handleApply} />
	)
}

export default ApplyJob;