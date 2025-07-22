import {Spotlight} from '@/components/ui/spotlight';
import Image from "next/image";
import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex min-h-screen items-center bg-black justify-center overflow-hidden relative">
			<Spotlight />
			<div className="w-full absolute left-0 top-0 min-h-96 pointer-events-none rotate-180">
				<Image
					src="/footer-grid.svg"
					alt="grid"
					width={1000}
					height={1000}
					className="w-full h-full opacity-40 dark:opacity-70 filter invert dark:filter-none"
				/>
			</div>

			<section className="light-border background-light800_dark200 shadow-light100_dark100 min-w-full rounded-[10px] px-4 py-10 z-10 shadow-md sm:min-w-[520px] sm:px-8">
				<div className="flex items-center justify-between gap-2">
					<div className="space-y-2.5">
						<h1 className="h2-bold text-dark100_light900">Join Remote Radar</h1>
						<p className="paragraph-regular text-dark500_light400">
							To get the latest remote jobs sent to your inbox
						</p>
					</div>

					<Image
						src="/logo.png"
						alt="Remote Radar Logo"
						width={60}
						height={60}
						className="object-contain"
					/>
				</div>

				{children}

				<SocialAuthForm />
			</section>
		</main>
	)
};

export default AuthLayout;