import {dailyTips} from "@/data";
import {getJobCounts} from "@/lib/actions/getJobCounts";
import { TrendingUp, CalendarDays, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const RightSidebar = async () => {
	const dayIndex = Math.floor(Date.now() / 86_400_000);

	const tipsPerDay = 5;
	const startIndex = (dayIndex * tipsPerDay) % dailyTips.length;

	const tipsToShow = Array.from({ length: tipsPerDay }).map((_, i) => {
		return dailyTips[(startIndex + i) % dailyTips.length];
	});

	const { dailyCount, weeklyCount, allCount } = await getJobCounts();

	const stats = [
		{ label: "New today", value: dailyCount, icon: <TrendingUp className="size-4 text-primary-500" /> },
		{ label: "This week", value: weeklyCount, icon: <CalendarDays className="size-4 text-primary-500" /> },
		{ label: "Total jobs", value: allCount, icon: <Layers className="size-4 text-primary-500" /> },
	];

	return (
		<section className="custom-scrollbar bg-white dark:bg-[#0a0a0a] sticky right-0 top-0 h-screen w-[290px] flex flex-col gap-5 overflow-y-auto border-l border-black/[0.06] dark:border-white/[0.08] px-5 pt-[84px] pb-6 max-xl:hidden">
			<div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] p-5">
				<h3 className="text-[11px] font-semibold text-[#999] dark:text-[#666] uppercase tracking-widest mb-5">
					Job Digest
				</h3>
				<div>
					{stats.map((stat, i) => (
						<div
							key={stat.label}
							className={cn(
								"flex items-center justify-between py-3",
								i < stats.length - 1 && "border-b border-black/[0.05] dark:border-white/[0.06]"
							)}
						>
							<div className="flex items-center gap-2.5">
								{stat.icon}
								<span className="text-sm text-[#666] dark:text-[#888]">{stat.label}</span>
							</div>
							<span className="text-sm font-semibold text-black dark:text-white tabular-nums">
								{stat.value.toLocaleString()}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] p-5">
				<h3 className="text-[11px] font-semibold text-[#999] dark:text-[#666] uppercase tracking-widest mb-5">
					Daily Tips
				</h3>
				<ul className="flex flex-col gap-5">
					{tipsToShow.slice(0, 4).map((tip, i) => (
						<li key={i} className="flex gap-3">
							<span className="flex-shrink-0 flex items-center justify-center size-5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#666] dark:text-[#999] text-[10px] font-semibold mt-0.5">
								{i + 1}
							</span>
							<p className="text-[13px] text-[#555] dark:text-[#999] leading-[1.6]">{tip}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}

export default RightSidebar;