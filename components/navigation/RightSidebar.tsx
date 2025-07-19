import ROUTES from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";

const recommendedJobs = [
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
];

const RightSidebar = () => {
	return (
		<section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 h-screen w-[350px] flex flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
			<div>
				<h2 className="h2-bold primary-text-gradient">Recommended For You</h2>

				<div className="mt-7 flex w-full flex-col gap-[30px]">
					{recommendedJobs.map(({ _id, title }) => (
						<Link key={_id} href={ROUTES.PROFILE(_id)} className="flex cursor-pointer items-center justify-between gap-7">
							<p className="body-large text-dark500_light700">{title}</p>
							<Image src="/icons/chevron-right.svg" alt="Chevron" width={20} height={20} className="invert-colors" />
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}

export default RightSidebar;