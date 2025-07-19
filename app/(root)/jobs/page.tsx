import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import ROUTES from "@/constants/routes";

const jobs = [
	{ _id: "1", title: "Software Engineer - Airbnb" },
	{ _id: "2", title: "Data Engineer - Palantir" },
	{ _id: "3", title: "Senior Software Engineer - Prismatic Software" },
	{ _id: "4", title: "Full Stack Software Engineer - Twilio" },
	{ _id: "5", title: "Staff Software Engineer - Discord" },
	{ _id: "6", title: "Frontend Engineer - Meta" },
	{ _id: "7", title: "Backend Engineer - Stripe" },
	{ _id: "8", title: "DevOps Engineer - Google" },
	{ _id: "9", title: "Machine Learning Engineer - OpenAI" },
	{ _id: "10", title: "Cloud Solutions Architect - AWS" },
]

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const Jobs = async ({ searchParams }: SearchParams) => {
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

			<div className="mt-10 flex w-full flex-col gap-6">
				{filteredJobs.map((job) => (
					<p key={job._id}>{job.title}</p>
				))}
			</div>
		</>
	)
};

export default Jobs;