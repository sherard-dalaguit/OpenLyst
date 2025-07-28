import ROUTES from '@/constants/routes';
import Link from 'next/link';
import {IconBookmark, IconBookmarkFilled, IconCircleCheckFilled, IconCircleDashedCheck} from "@tabler/icons-react";
import {getTimeStamp, truncateByCommas} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

interface Props {
	job: JobType;
}

const JobCard = (
	{ job: { _id, sourceJobId, title, companyName, location, category, experienceLevel, description, salaryMin, salaryMax, jobType, sourceId, sourceLink, sourceName, postedAt, isBookmarked, isApplied} }: Props
) => {
	return (
		<div className="card-wrapper lg:w-48/100 rounded-[10px] p-9 sm:px-11">
			<div className="flex flex-row items-start justify-between gap-5 sm:flex-row">
				<div className="flex-1">
					<Link href={ROUTES.JOB(_id)}>
						<h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
							{title}
						</h3>
					</Link>
				</div>

				<div className="flex items-center gap-3">
					{isBookmarked ? <IconBookmarkFilled /> : <IconBookmark />}
					{isApplied ? <IconCircleCheckFilled /> : <IconCircleDashedCheck />}
				</div>
			</div>

			<h4 className="text-dark100_light900 mt-2">
				{companyName}
			</h4>

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
				<h4 className="text-dark100_light900">
					{sourceName} posted {getTimeStamp(new Date(postedAt))}
					{/*Posted {getTimeStamp(new Date(postedAt))}*/}
				</h4>
			</div>
		</div>
	)
};

export default JobCard;