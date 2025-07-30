import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import JobCard from "@/components/cards/JobCard";
import ROUTES from "@/constants/routes";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_BOOKMARK} from "@/constants/states";
import {getSavedJobs} from "@/lib/actions/saved.action";

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const SavedJobsPage = async ({ searchParams }: SearchParams) => {
	const { page, pageSize, query, jobType, experienceLevel, category, source, salary, datePosted, sortBy } = await searchParams;

	const { success, data, error } = await getSavedJobs({
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

	const { collection } = data || {};
	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Saved Jobs</h1>

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
				empty={EMPTY_BOOKMARK}
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

		</>
	)
};

export default SavedJobsPage;