import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import JobCard from "@/components/cards/JobCard";
import ROUTES from "@/constants/routes";
import {jobs} from "@/data";
import {auth} from "@/auth";

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const Jobs = async ({ searchParams }: SearchParams) => {
	const session = await auth();
	console.log("Session:", session);

	const { query = "" } = await searchParams;

	const filteredJobs = jobs.filter((job) => job.title.toLowerCase().includes(query?.toLowerCase()))

	return (
		<>
			<section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Jobs</h1>
			</section>

			<section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					imgSrc="/icons/search.svg"
					placeholder="Search jobs..."
					otherClasses="flex-1"
					route={ROUTES.HOME}
				/>
			</section>

			<HomeFilter />

			<div className="mt-10 flex w-full flex-col lg:flex-row lg:flex-wrap gap-6">
				{filteredJobs.map((job) => (
					<JobCard
						key={job._id}
						_id={job._id}
						title={job.title}
						companyName={job.companyName}
						companyLogoUrl={job.companyLogoUrl}
						datePosted={job.datePosted}
						jobType={job.jobType}
						experienceLevel={job.experienceLevel}
						salary={job.salary}
						category={job.category}
						snippet={job.snippet}
						applyUrl={job.applyUrl}
						source={job.source}
						isBookmarked={job.isBookmarked}
						isApplied={job.isApplied}
					/>
				))}
			</div>
		</>
	)
};

export default Jobs;