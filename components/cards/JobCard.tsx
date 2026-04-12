import Link from 'next/link';
import {getTimeStamp, truncateByCommas} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import SaveJob from "@/components/jobs/SaveJob";
import {hasSavedJob} from "@/lib/actions/saved.action";
import ApplyJob from "@/components/jobs/ApplyJob";
import {hasAppliedJob} from "@/lib/actions/applied.action";

interface Props {
	job: JobType;
}

const COMPANY_COLORS = [
	{ bg: 'rgba(247, 0, 255, 0.12)', text: '#f700ff' },
	{ bg: 'rgba(250, 138, 46, 0.12)', text: '#fa8a2e' },
	{ bg: 'rgba(99, 102, 241, 0.12)', text: '#818cf8' },
	{ bg: 'rgba(20, 184, 166, 0.12)', text: '#2dd4bf' },
	{ bg: 'rgba(245, 158, 11, 0.12)', text: '#fbbf24' },
	{ bg: 'rgba(236, 72, 153, 0.12)', text: '#f472b6' },
	{ bg: 'rgba(34, 197, 94, 0.12)', text: '#4ade80' },
];

const JobCard = (
{job: {
	_id,
	sourceJobId,
	title,
	companyName,
	location,
	category,
	experienceLevel,
	description,
	salaryMin,
	salaryMax,
	jobType,
	sourceId,
	sourceLink,
	sourceName,
	postedAt,
	isBookmarked,
	isApplied
}}: Props) => {
	const hasSavedJobPromise = hasSavedJob({ jobId: _id });
	const hasAppliedJobPromise = hasAppliedJob({ jobId: _id });

	const colorIndex = companyName
		.split('')
		.reduce((acc, c) => acc + c.charCodeAt(0), 0) % COMPANY_COLORS.length;
	const companyColor = COMPANY_COLORS[colorIndex];

	const isRecent = Date.now() - new Date(postedAt).getTime() < 24 * 60 * 60 * 1000;

	return (
		<div className="card-wrapper lg:w-48/100 rounded-[10px] p-9 sm:px-11 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.18] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
			<div className="flex flex-row items-start justify-between gap-5 sm:flex-row">
				<div className="flex-1">
					<Link href={sourceLink} target="_blank" rel="noopener noreferrer">
						<h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
							{title}
						</h3>
					</Link>
				</div>

				<div className="flex items-center gap-3 text-[#666] dark:text-[#888]">
					<SaveJob jobId={_id} hasSavedJobPromise={hasSavedJobPromise} />
					<ApplyJob jobId={_id} hasAppliedJobPromise={hasAppliedJobPromise} />
				</div>
			</div>

			<div className="flex items-center gap-2.5 mt-2">
				<div
					style={{ backgroundColor: companyColor.bg }}
					className="flex-shrink-0 size-7 rounded-md flex items-center justify-center"
				>
					<span style={{ color: companyColor.text }} className="text-[11px] font-bold uppercase leading-none">
						{companyName.slice(0, 2)}
					</span>
				</div>
				<h4 className="text-dark400_light700 text-sm">{companyName}</h4>
			</div>

			<div className="mt-3.5 flex w-full flex-wrap gap-2">
				{jobType && (
					<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
						<div className="flex-center space-x-2">
							<span>{jobType}</span>
						</div>
					</Badge>
				)}

				{experienceLevel && (
					<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
						<div className="flex-center space-x-2">
							<span>{experienceLevel}</span>
						</div>
					</Badge>
				)}

				{salaryMax && salaryMin && (
					salaryMin !== salaryMax ? (
						<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
							<div className="flex-center space-x-2">
								<span>${salaryMin} - ${salaryMax}</span>
							</div>
						</Badge>
					) : (
						<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
							<div className="flex-center space-x-2">
								<span>${salaryMin}</span>
							</div>
						</Badge>
					)
				)}

				{category && (
					<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
						<div className="flex-center space-x-2">
							<span>{category}</span>
						</div>
					</Badge>
				)}

				{location && (
					<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
						<div className="flex-center space-x-2">
							<span>{truncateByCommas(location)}</span>
						</div>
					</Badge>
				)}
			</div>

			<div className="flex-between mt-6 w-full flex-wrap gap-3">
				<h4 className="flex items-center gap-2 text-sm text-dark400_light700">
					{isRecent && (
						<span className="size-1.5 rounded-full bg-green-500 shrink-0" />
					)}
					Posted {getTimeStamp(new Date(postedAt))}
				</h4>
			</div>
		</div>
	)
};

export default JobCard;