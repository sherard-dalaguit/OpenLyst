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
			<SheetContent side="left" className="background-light900_dark200 border-none p-6">
				<SheetTitle className="hidden">Navigation</SheetTitle>
				<Link href="/" className="flex items-center gap-1">
					<Image
						src="/logo.png"
						width={30}
						height={30}
						alt="logo"
					/>
					<p className="h2-semibold font-space-grotesk primary-text-gradient">Remote Radar</p>
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
									<Button type="submit" className="base-medium w-fit !bg-transparent px-4 py-3">
										<LogOut className="size-5 text-white" />
										<span className="text-dark300_light900">Log Out</span>
									</Button>
								</form>
							</SheetClose>
						) : (
							<>
								<SheetClose asChild>
									<Link href={ROUTES.SIGN_IN}>
										<Button className="small-medium primary-gradient min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
											Log In
										</Button>
									</Link>
								</SheetClose>

								<SheetClose asChild>
									<Link href={ROUTES.SIGN_UP}>
										<Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
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