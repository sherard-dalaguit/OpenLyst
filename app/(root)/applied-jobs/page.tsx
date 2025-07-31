import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import JobCard from "@/components/cards/JobCard";
import ROUTES from "@/constants/routes";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_APPLIED} from "@/constants/states";
import {getAppliedJobs} from "@/lib/actions/applied.action";
import Pagination from "@/components/Pagination";

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const AppliedJobsPage = async ({ searchParams }: SearchParams) => {
	const { page, pageSize, query, jobType, experienceLevel, category, source, salary, datePosted, sortBy } = await searchParams;

	const { success, data, error } = await getAppliedJobs({
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

	const { collection, isNext } = data || {};
	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Applied Jobs</h1>

			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					imgSrc="/icons/search.svg"
					placeholder="Search jobs..."
					otherClasses="flex-1"
					route={ROUTES.SAVED_JOBS}
				/>
			</div>

			<HomeFilter />

			<DataRenderer
				empty={EMPTY_APPLIED}
				success={success}
				error={error}
				data={collection}
				render={(collection) => (
					<div className="mt-10 flex w-full flex-col lg:flex-row lg:flex-wrap gap-6">
						{collection.map((item) => (
							<JobCard key={item._id} job={item.job} />
						))}
					</div>
				)}
			/>

			<Pagination page={page} isNext={isNext || false} />
		</>
	)
};

export default AppliedJobsPage;