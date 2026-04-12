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
				const href =
          item.route === "/settings"
            ? userId
              ? `/settings/${userId}`
              : "/sign-in"
            : item.route;

        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route ||
          pathname === href;

				const LinkComponent = (
					<Link
						href={href}
						key={item.label}
						className={cn(
							'flex items-center justify-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 relative',
							isActive
								? 'bg-black/[0.06] dark:bg-white/[0.08] text-black dark:text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-[3px] before:rounded-full before:bg-primary-500'
								: 'text-[#666] dark:text-[#888] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-black dark:hover:text-white'
						)}
					>
						{item.icon}
						<p className={cn(
							'text-sm',
							isActive ? 'font-medium' : 'font-normal',
							!isMobileNav && 'max-lg:hidden',
						)}>
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