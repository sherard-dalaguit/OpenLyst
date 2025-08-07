"use client";

import {sidebarLinks} from "@/data";
import {SheetClose} from "@/components/ui/sheet";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {cn} from "@/lib/utils";

const NavLinks = ({
	isMobileNav = false,
	userId
}: {
	isMobileNav?: boolean,
	userId?: string
}) => {
	const pathname = usePathname();

	return (
		<>
			{sidebarLinks.map((item) => {
				const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

				if (item.route === '/settings') {
					if (userId) item.route = `/settings/${userId}`;
				}

				const LinkComponent = (
					<Link
						href={item.route}
						key={item.label}
						className={cn(
							isActive
								? 'primary-gradient rounded-lg text-light-900'
								: 'text-dark300_light900',
							'flex items-center justify-start gap-4 bg-transparent p-4'
						)}
					>
						{item.icon}
						<p className={
							cn(
								isActive ? 'base-bold' : 'base-medium',
								!isMobileNav && 'max-lg:hidden',
							)}
						>
							{item.label}
						</p>
					</Link>
				);

				return isMobileNav ? (
					<SheetClose asChild key={item.route}>
						{LinkComponent}
					</SheetClose>
				) : (
					<div key={item.route}>
						{LinkComponent}
					</div>
				);
			})}
		</>
	)
};

export default NavLinks;