import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import JobCard from "@/components/cards/JobCard";
import ROUTES from "@/constants/routes";
import {getJobs} from "@/lib/actions/job.action";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_JOB} from "@/constants/states";
import Pagination from "@/components/Pagination";
import {formatCategoryTitle} from "@/lib/utils";

interface Props {
	params: { category: string };
	searchParams: Promise<{ [key: string]: string }>;
}

const Jobs = async ({ params, searchParams }: Props) => {
	const { category } = params;
	const { page, pageSize, query, jobType, experienceLevel, source, salary, datePosted, sortBy } = await searchParams;

	const { success, data, error } = await getJobs({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 40,
		query: query || '',
		jobType: jobType || '',
		experienceLevel: experienceLevel || '',
		category: category || '',
		source: source || '',
		salary: salary ? Number(salary) : undefined,
		datePosted: datePosted || 'anytime',
		sort: sortBy || 'newest'
	})

	const { jobs, isNext } = data || {};
	return (
		<>
			<section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
				<h1 className="h1-bold text-dark100_light900">{formatCategoryTitle(category)} Jobs</h1>
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

			<DataRenderer
				success={success}
				error={error}
				data={jobs}
				empty={EMPTY_JOB}
				render={(jobs) => (
					<div className="mt-10 flex w-full flex-col lg:flex-row lg:flex-wrap gap-6">
						{jobs.map((job) => (
							<JobCard key={job._id} job={job} />
						))}
					</div>
				)}
			/>

			<Pagination page={page} isNext={isNext || false} />
		</>
	)
};

export default Jobs;