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

const HomeFilter = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

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

	// inside your HomeFilter component:
	const rawSalary = searchParams.get("salary") ?? "0"
	const initialIndex = salaryMarks.findIndex(s => s.toString() === rawSalary) || 0

	const [sliderIndex, setSliderIndex] = useState<number>(initialIndex)

	const activeFilters = jobFilters
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

	const clearAllFilters = () => {
		const allKeys = jobFilters.map(filter => filter.key);
		const newUrl = removeKeysFromUrlQuery({
			params: searchParams.toString(),
			keysToRemove: allKeys,
		});
		router.push(newUrl, { scroll: false });
	}

	const handleRangeApply = (filterKey: string, optionValue: string) => {
		const params = new URLSearchParams(searchParams.toString())
		// 2) set (or overwrite) the one you care about
		params.set(filterKey, optionValue)
		// 3) push a clean URL of form /jobs?<only the params>
		router.push(`${pathname}?${params.toString()}`, { scroll: false })
	};

	const handleDropdownSelect = (filterKey: string, value: string) => {
    // build a fresh URLSearchParams so we don’t drag along broken bits
    const params = new URLSearchParams(searchParams.toString())
    params.set(filterKey, value)          // overwrite old value
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
        {activeFilters.length > 0 && (
          <Button size="sm" variant="ghost" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        )}
			</div>
		</div>
  )
};

export default HomeFilter;