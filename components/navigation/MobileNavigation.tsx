import {
  Sheet,
	SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import NavLinks from "@/components/navigation/NavLinks";
import {auth, signOut} from "@/auth";
import {LogOut} from "lucide-react";

const MobileNavigation = async () => {
	const session = await auth();
	const userId = session?.user?.id;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Image
					src="/icons/hamburger.svg"
					width={36}
					height={36}
					alt="menu"
					className="invert-colors sm:hidden"
				/>
			</SheetTrigger>
			<SheetContent side="left" className="bg-white dark:bg-[#0a0a0a] border-r border-black/[0.06] dark:border-white/[0.08] p-5">
				<SheetTitle className="hidden">Navigation</SheetTitle>
				<Link href="/" className="flex items-center gap-1">
					<Image
						src="/logo.png"
						width={30}
						height={30}
						alt="logo"
					/>
					<p className="h2-semibold font-space-grotesk primary-text-gradient">OpenLyst</p>
				</Link>

				<div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
					<SheetClose asChild>
						<section className="flex h-full flex-col gap-6 pt-16">
							<NavLinks isMobileNav />
						</section>
					</SheetClose>

					<div className="flex flex-col gap-3">
						{userId ? (
							<SheetClose asChild>
								<form action={async () => {
									"use server";
									await signOut();
								}}>
									<Button type="submit" className="w-fit !bg-transparent px-3 py-2.5 text-sm font-medium text-dark-300 dark:text-light-900 hover:bg-light-800/70 dark:hover:bg-dark-300/70 rounded-lg transition-colors shadow-none">
										<LogOut className="size-4" />
										<span>Log Out</span>
									</Button>
								</form>
							</SheetClose>
						) : (
							<>
								<SheetClose asChild>
									<Link href={ROUTES.SIGN_IN}>
										<Button className="primary-gradient min-h-[40px] w-full rounded-lg px-4 py-2 text-sm font-medium text-white shadow-none">
											Log In
										</Button>
									</Link>
								</SheetClose>

								<SheetClose asChild>
									<Link href={ROUTES.SIGN_UP}>
										<Button className="btn-tertiary text-dark400_light900 min-h-[40px] w-full rounded-lg border border-light-700/60 dark:border-dark-400/60 px-4 py-2 text-sm font-medium shadow-none">
											Sign Up
										</Button>
									</Link>
								</SheetClose>
							</>
						)}

					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
};

export default MobileNavigation;