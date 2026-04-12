"use client";

import {Input} from "@/components/ui/input";
import Image from "next/image";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";

interface Props {
	route: string;
	imgSrc: string;
	placeholder: string;
	otherClasses?: string;
}

const LocalSearch = ({ route, imgSrc, placeholder, otherClasses }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const query = searchParams.get("query") || "";

	const [searchQuery, setSearchQuery] = useState(query);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (searchQuery) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: "query",
					value: searchQuery,
				});

				router.push(newUrl, { scroll: false });
			} else {
				if (pathname === route) {
					const newUrl = removeKeysFromUrlQuery({
						params: searchParams.toString(),
						keysToRemove: ["query"],
					});

					router.push(newUrl, { scroll: false });
				}
			}
		}, 300)

		return () => clearTimeout(delayDebounceFn);
	}, [searchQuery, router, route, searchParams, pathname]);

	return (
		<div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 border border-black/[0.08] dark:border-white/[0.1] transition-all duration-200 focus-within:border-primary-500/50 focus-within:shadow-[0_0_0_3px_rgba(247,0,255,0.08)] ${otherClasses}`}>
			<Image 
				src={imgSrc}
				width={24}
				height={24}
				alt="search icon"
				className="cursor-pointer"
			/>
			<Input
				type="text"
				placeholder={placeholder}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
			/>
		</div>
	)
};

export default LocalSearch;