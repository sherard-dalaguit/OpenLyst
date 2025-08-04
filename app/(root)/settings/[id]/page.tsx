import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { Label } from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {jobFilters} from "@/constants/filters";
import {Switch} from "@/components/ui/switch";

const SettingsPage = async ({ params, searchParams }: RouteParams) => {
	const { id } = await params;
  const { page, pageSize } = await searchParams;

	if (!id) notFound();

  const loggedInUser = await auth();
  const { success, data, error } = await getUser({
    userId: id,
  });

	const categoryFilter = jobFilters.find(f => f.key === "category")
  const categories = categoryFilter?.options ?? []

	if (!success)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="h1-bold text-dark100_light900">User not found</h1>
        <p className="paragraph-regular text-dark200_light800 max-w-md">
          {error?.message}
        </p>
      </div>
    );

  const { user } = data!;

	return (
		<>
			<h1 className="h1-bold text-dark100_light900 mb-5">Settings</h1>

			<section className="flex flex-col-reverse items-start justify-between sm:flex-row">
				<div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={user._id}
            name={user.name}
            imageUrl={user.image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bolder"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              {user.email}
            </p>

						<div className="mt-2 flex items-center justify-start gap-1">
							<Image
								src={'/icons/calendar.svg'}
								alt='calendar icon'
								width={20}
								height={20}
							/>
							<p className="paragraph-regular text-dark200_light800">
								{dayjs(user.createdAt).format("MMMM YYYY")}
							</p>
						</div>
          </div>
        </div>

				<div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href="/">
							{/* TODO: Create Modal For Deleting Account */}
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
                Delete Account
              </Button>
            </Link>
          )}
        </div>
			</section>

			<h1 className="h1-bold text-dark100_light900 mt-10">Email Alerts</h1>

			<div className="flex items-center my-8 space-x-2">
				<Switch id="airplane-mode" className="body-medium rounded-lg capitalize shadow-none bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300" />
				<Label htmlFor="airplane-mode">Receive Email Alerts?</Label>
			</div>

			<section className="flex flex-row gap-16 max-sm:flex-col">
				<div className="flex flex-col gap-3">
					<h2 className="h2-semibold text-dark100_light900">Job Categories</h2>
					<div className="flex flex-col gap-3">
						{categories.map((category, id) => (
							<div key={id} className="flex items-center gap-3">
								<Checkbox id={category.label} className="background-light900_dark300 border-light-400" />
								<Label htmlFor={category.value} className="text-md text-dark500_light800">{category.label}</Label>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<h2 className="h2-semibold text-dark100_light900">Frequency</h2>
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<Checkbox id="daily" className="background-light900_dark300 border-light-400" />
							<Label htmlFor="daily" className="text-md text-dark500_light800">Daily</Label>
						</div>
						<div className="flex items-center gap-3">
							<Checkbox id="weekly" className="background-light900_dark300 border-light-400" />
							<Label htmlFor="weekly" className="text-md text-dark500_light800">Weekly</Label>
						</div>
					</div>
				</div>
			</section>
		</>
	)
};

export default SettingsPage;