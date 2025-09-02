import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import { Label } from "@/components/ui/label";
import {jobFilters} from "@/constants/filters";
import ReceiveAlertsSwitch from "@/components/forms/ReceiveAlertsSwitch";
import PreferencesForm from "@/components/forms/PreferencesForm";
import {Metadata} from "next";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your profile, preferences, and email job alert settings on Nomadlyst.",
  openGraph: {
    title: "Profile | Nomadlyst",
    description: "Update your personal information, job preferences, and saved alerts.",
    url: "https://nomadlyst.com/settings",
    siteName: "Nomadlyst",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile | Nomadlyst",
    description:
      "Customize your job search experience with Nomadlyst’s profile settings.",
  },
};

const SettingsPage = async ({ params, searchParams }: RouteParams) => {
	const { id } = await params;
  const { page, pageSize } = await searchParams;

	if (!id) notFound();

  const loggedInUser = await auth();
  const { success, data, error } = await getUser({
    userId: id,
  });

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

	const categoryFilter = jobFilters.find(f => f.key === "category")
  const allCategories = categoryFilter?.options ?? []

	const initialCategoryValues = user.preferences.categories
  .map(label => {
    const opt = allCategories.find(o => o.label === label)
    return opt ? opt.label : null
  })
  .filter((x): x is string => x !== null)

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
						<DeleteAccountDialog userId={user._id.toString()} />
          )}
        </div>
			</section>

			<h1 className="h1-bold text-dark100_light900 mt-10">Email Alerts</h1>

			<div className="flex items-center my-8 space-x-2">
				<ReceiveAlertsSwitch
					userId={user._id}
					initial={user.preferences.receiveAlerts}
				/>
				<Label htmlFor="receive-alerts" className="text-md text-dark500_light800">Receive Email Alerts?</Label>
			</div>

			<PreferencesForm
        userId={user._id}
        initialCategories={initialCategoryValues}
        initialFrequency={user.preferences.frequency}
        allCategories={allCategories}
      />
		</>
	)
};

export default SettingsPage;