import {dailyTips} from "@/data";
import {countJobsSince} from "@/lib/utils";

const RightSidebar = async () => {
	const today = new Date();
  const dayNumber = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const tipsPerDay = 5;
  const startIndex = dayNumber % dailyTips.length;

  const tipsToShow = Array.from({ length: tipsPerDay }).map((_, i) => {
    return dailyTips[(startIndex + i) % dailyTips.length];
  });

	const dailySince = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const weeklySince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
	const foreverSince = new Date(0);
	const [dailyCount, weeklyCount, allCount] = await Promise.all([
		countJobsSince(dailySince),
		countJobsSince(weeklySince),
		countJobsSince(foreverSince),
	]);

	return (
		<section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 h-screen w-[350px] flex flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
			<div>
				<h2 className="h2-bold"><span className="primary-text-gradient">Job Digest Summary</span> 📊</h2>

				<ul className="my-7 space-y-2 text-dark500_light700">
					<li>New today: {dailyCount}</li>
					<li>New this week: {weeklyCount}</li>
					<li>Total jobs: {allCount}</li>
				</ul>
			</div>

			<div>
				<h2 className="h2-bold"><span className="primary-text-gradient">Daily Job Hunt Tips</span> 💡</h2>

				<ul className="mt-7 flex flex-col gap-[30px] text-dark500_light700">
					{tipsToShow.map((tip, i) => (
						<li key={i}>{tip}</li>
					))}
				</ul>
			</div>
		</section>
	)
}

export default RightSidebar;