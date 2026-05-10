import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import JobCard from "@/components/cards/JobCard";
import ROUTES from "@/constants/routes";
import {getJobs} from "@/lib/actions/job.action";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_JOB} from "@/constants/states";
import Pagination from "@/components/Pagination";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Browse Remote Jobs",
  description: "Explore thousands of remote jobs across engineering, product, design, data, and more. Updated daily with powerful filters and email digests.",
  alternates: {
    canonical: "/jobs",
  },
  openGraph: {
    title: "Browse Remote Jobs | OpenLyst",
    description: "Discover the latest remote job opportunities, updated daily. Filter by category, salary, and more.",
    url: "https://www.openlyst.io/jobs",
    siteName: "OpenLyst",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Remote Jobs | OpenLyst",
    description: "Explore thousands of remote jobs curated daily. Filter by category, salary, and more.",
  },
};

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const Jobs = async ({ searchParams }: SearchParams) => {
	const { page, pageSize, query, jobType, experienceLevel, category, source, salary, datePosted, sortBy } = await searchParams;

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
				<h1 className="h1-bold text-dark100_light900">All Jobs</h1>
			</section>

			<section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					imgSrc="/icons/search.svg"
					placeholder="Search roles, companies, or keywords..."
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
					<div className="mt-14 flex w-full flex-col lg:flex-row lg:flex-wrap gap-6">
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