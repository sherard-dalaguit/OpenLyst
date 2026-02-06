import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import JobCard from "@/components/cards/JobCard";
import ROUTES from "@/constants/routes";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_BOOKMARK} from "@/constants/states";
import {getSavedJobs} from "@/lib/actions/saved.action";
import Pagination from "@/components/Pagination";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Saved Jobs",
  description: "View and manage all the remote jobs you've saved for later. Keep track of opportunities easily with OpenLyst.",
  openGraph: {
    title: "Saved Jobs | OpenLyst",
    description: "Access all your saved remote job listings in one place.",
    url: "https://openlyst.io/saved-jobs",
    siteName: "OpenLyst",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saved Jobs | OpenLyst",
    description: "Keep track of all your saved remote job opportunities.",
  },
};

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

	const { collection, isNext } = data || {};
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

			<Pagination page={page} isNext={isNext || false} />
		</>
	)
};

export default SavedJobsPage;