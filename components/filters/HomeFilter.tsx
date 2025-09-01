"use client";

import {jobFilters} from "@/constants/filters";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";
import {Slider} from "@/components/ui/slider";
import { useState } from "react";
import {SliderRange, SliderThumb, SliderTrack} from "@radix-ui/react-slider";
import {pushCategoryRoute} from "@/lib/utils";

const salaryMarks = [
	0,
	25000,
	50000,
	75000,
	100000,
	125000,
	150000,
	200000,
	300000,
	400000,
]

const HomeFilter = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const segments = pathname.split("/").filter(Boolean);
	const categorySlug = segments[0] === "jobs" && segments[1] ? segments[1] : null;

	const rawSalary = searchParams.get("salary") ?? "0"
	const initialIndex = salaryMarks.findIndex(s => s.toString() === rawSalary) || 0

	const [sliderIndex, setSliderIndex] = useState<number>(initialIndex)

	const baseActiveFilters = jobFilters
		.map((filter) => {
			const value = searchParams.get(filter.key)
			if (!value) return null

			const opt = filter.options?.find(o => o.value === value)

			return { key: filter.key, filterName: filter.name, optionLabel: opt?.label ?? value }
		})
		.filter(Boolean) as {
			key: string
			filterName: string
			optionLabel: string
		}[]

	const categoryFilterDef = jobFilters.find((f) => f.key === "category");
	const categoryLabel =
		categorySlug && categoryFilterDef?.options
			? categoryFilterDef.options.find((o) => o.value === categorySlug)?.label ?? categorySlug
			: null;

	const activeFilters = [
		...(categorySlug && categoryLabel
			? [{ key: "category", filterName: categoryFilterDef?.name ?? "Category", optionLabel: categoryLabel }]
			: []),
		...baseActiveFilters,
	];

	const clearAllFilters = () => {
		router.push("/jobs", { scroll: false });
	};

	const handleRangeApply = (filterKey: string, optionValue: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(filterKey, optionValue)
		router.push(`${pathname}?${params.toString()}`, { scroll: false })
	};

	const handleDropdownSelect = (filterKey: string, value: string) => {
    if (filterKey === "category") {
			pushCategoryRoute(router, new URLSearchParams(searchParams.toString()), value);
			return;
		}

		const params = new URLSearchParams(searchParams.toString())
    params.set(filterKey, value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

	const handleTypeClick = (filterKey: string, optionValue: string) => {
    const raw = searchParams.get(filterKey) ?? ""
    const values = raw.split(",").filter(Boolean)

    const newValues = values.includes(optionValue)
      ? values.filter(v => v !== optionValue)
      : [...values, optionValue]

    const newUrl =
      newValues.length === 0
        ? removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: [filterKey],
          })
        : formUrlQuery({
            params: searchParams.toString(),
            key: filterKey,
            value: newValues.join(","),
          })

    router.push(newUrl, { scroll: false })
  }

	return (
		<div className="mt-10">
			<div className="mt-10 hidden sm:flex flex-wrap gap-3">
				{jobFilters.map((filter) => (
					<div key={filter.key} className="filter-item">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									key={filter.name}
									className="body-medium rounded-lg px-6 py-3 capitalize shadow-none bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
								>
									{filter.name}
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent className="background-light900_dark300 border-none">
								{filter.type === 'dropdown' && filter.options?.map((option) => (
									<DropdownMenuItem
										key={option.value}
										onClick={(e) => {
											e.preventDefault()
											handleDropdownSelect(filter.key, option.value)
										}}
									>
										{option.label}
									</DropdownMenuItem>
								))}

								{filter.type === 'checkbox' && filter.options?.map((option) => {
									const raw     = searchParams.get(filter.key) ?? ""
									const list    = raw.split(",").filter(Boolean)
									const checked = list.includes(option.value)

									return (
										<DropdownMenuCheckboxItem
											key={option.value}
											checked={checked}
											onCheckedChange={() => handleTypeClick(filter.key, option.value)}
											onSelect={(e) => e.preventDefault()}
										>
											{option.label}
										</DropdownMenuCheckboxItem>
									)
								})}

								{filter.type === 'rangeSlider' && (
									<div className="p-4 flex flex-col items-center gap-2">
										<span className="text-md">
											{filter.name}: ${salaryMarks[sliderIndex]}+
										</span>
										<span className="text-sm text-light-500">
											Note: Not all jobs may have a salary listed
										</span>

										<Slider
											value={[sliderIndex]}
											min={0}
											max={salaryMarks.length - 1}
											step={1}
											onValueChange={([val]) => setSliderIndex(val)}
											className="w-full mt-2 bg-light-800 rounded-2xl"
										>
											<SliderTrack>
												<SliderRange />
											</SliderTrack>
											<SliderThumb />
										</Slider>

										<Button
											size="sm"
											className="mt-2 primary-gradient"
											onClick={() => handleRangeApply(filter.key, salaryMarks[sliderIndex].toString())}
										>
											Apply
										</Button>
									</div>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				))}
        {(activeFilters.length > 0 || !!categorySlug) && (
          <Button size="sm" className="primary-gradient" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        )}
			</div>
		</div>
  )
};

export default HomeFilter;