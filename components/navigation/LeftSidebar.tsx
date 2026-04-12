import ROUTES from "@/constants/routes";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/navigation/NavLinks";
import {auth, signOut} from "@/auth";
import { LogOut } from 'lucide-react';

const LeftSidebar = async () => {
	const session = await auth();
	const userId = session?.user?.id;

	return (
		<section className="custom-scrollbar bg-white dark:bg-[#0a0a0a] sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r border-black/[0.06] dark:border-white/[0.08] p-4 pt-[72px] max-sm:hidden lg:w-[260px]">
			<div className="flex flex-1 flex-col gap-0.5 pt-4">
				<NavLinks userId={userId} />
			</div>

			<div className="flex flex-col gap-2 pb-2">
				{userId ? (
					<form action={
						async () => {
							"use server";
							await signOut({ redirectTo: "/" });
						}}
					>
						<Button
							type="submit"
							className="w-full justify-start gap-3 !bg-transparent px-3 py-2.5 text-sm font-medium text-dark-300 dark:text-light-900 hover:bg-light-800/70 dark:hover:bg-dark-300/70 rounded-lg transition-colors shadow-none"
						>
							<LogOut className="size-4 shrink-0" />
							<span className="max-lg:hidden">Log Out</span>
						</Button>
					</form>
				) : (
					<>
						<Button className="primary-gradient min-h-[40px] w-full rounded-lg px-4 py-2 text-sm font-medium text-white shadow-none" asChild>
							<Link href={ROUTES.SIGN_IN}>
								<Image
									src="/icons/account.svg"
									alt="Account"
									width={18}
									height={18}
									className="invert-colors lg:hidden"
								/>
								<span className="max-lg:hidden">Log In</span>
							</Link>
						</Button>

						<Button className="btn-tertiary text-dark400_light900 min-h-[40px] w-full rounded-lg px-4 py-2 text-sm font-medium shadow-none border border-light-700/60 dark:border-dark-400/60" asChild>
							<Link href={ROUTES.SIGN_UP}>
								<Image
									src="/icons/sign-up.svg"
									alt="Sign Up"
									width={18}
									height={18}
									className="invert-colors lg:hidden"
								/>
								<span className="max-lg:hidden">Sign Up</span>
							</Link>
						</Button>
					</>
				)}
			</div>
		</section>
	)
}

export default LeftSidebar;