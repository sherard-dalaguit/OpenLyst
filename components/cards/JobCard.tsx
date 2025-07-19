import ROUTES from '@/constants/routes';
import Link from 'next/link';
import {IconBookmark, IconBookmarkFilled, IconCircleCheckFilled, IconCircleDashedCheck} from "@tabler/icons-react";
import {getTimeStamp} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

interface JobProps {
	_id: string;
	title: string;
	companyName: string;
	companyLogoUrl: string;
	datePosted: string;
	jobType: string;
	experienceLevel: string;
	salary: string;
	category: string;
	snippet: string;
	applyUrl: string;
	source: string;
	isBookmarked: boolean;
	isApplied: boolean;
}

const JobCard = (
	{
		_id,
		title,
		companyName,
		companyLogoUrl,
		datePosted,
		jobType,
		experienceLevel,
		salary,
		category,
		snippet,
		applyUrl,
		source,
		isBookmarked,
		isApplied
	}: JobProps
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
					{isApplied ? <IconCircleDashedCheck /> : <IconCircleCheckFilled />}
				</div>
			</div>

			<h4 className="text-dark100_light900 mt-2">
				{companyName}
			</h4>

			<div className="mt-3.5 flex w-full flex-wrap gap-2">
				<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
					<div className="flex-center space-x-2">
						<span>{jobType}</span>
					</div>
				</Badge>
				<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
					<div className="flex-center space-x-2">
						<span>{experienceLevel}</span>
					</div>
				</Badge>
				<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
					<div className="flex-center space-x-2">
						<span>{salary}</span>
					</div>
				</Badge>
				<Badge className="small-semibold background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
					<div className="flex-center space-x-2">
						<span>{category}</span>
					</div>
				</Badge>
			</div>

			<div className="flex-between mt-6 w-full flex-wrap gap-3">
				<h4 className="text-dark100_light900">
					{source} posted {getTimeStamp(new Date(datePosted))}
				</h4>
			</div>
		</div>
	)
};

export default JobCard;