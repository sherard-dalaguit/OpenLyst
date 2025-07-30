"use client"

import { useSession } from "next-auth/react";
import {use, useState} from "react";
import {IconBookmark, IconBookmarkFilled} from "@tabler/icons-react";
import { toast } from "sonner";
import {toggleSaveJob} from "@/lib/actions/saved.action";

const SaveJob = ({
	jobId,
	hasSavedJobPromise
}: {
	jobId: string,
	hasSavedJobPromise: Promise<ActionResponse<{ saved: boolean }>>
}) => {
	const session = useSession();
	const userId = session?.data?.user?.id;

	const { data } = use(hasSavedJobPromise);

	const { saved: hasSaved } = data || { saved: false };

	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async () => {
		if (isLoading) return;
		if (!userId) return toast.error("Error", {description: "You must be logged in to save jobs."});

		setIsLoading(true);

		try {
			const { success, data, error } = await toggleSaveJob({ jobId });

			if (!success) throw new Error(error?.message || "Failed to save job");

			toast.success("Success", {description: data?.saved ? "Job saved successfully!" : "Job removed from saved list."});
		} catch (error) {
			toast.error("Error", {description: error instanceof Error ? error.message : "An unexpected error occurred."});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		hasSaved
			? <IconBookmarkFilled className={`cursor-pointer ${isLoading && 'opacity-50'}`} onClick={handleSave} />
			: <IconBookmark className={`cursor-pointer ${isLoading && 'opacity-50'}`} onClick={handleSave} />
	)
}

export default SaveJob;