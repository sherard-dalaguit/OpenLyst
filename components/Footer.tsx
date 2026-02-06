import {SpotlightReverse} from "@/components/ui/spotlight-reverse";
import {IconBriefcase, IconSend} from "@tabler/icons-react";
import Image from "next/image";
import LitButton from "@/components/ui/LitButton";
import Link from "next/link";

const Footer = () => {
	return (
		<footer className="w-full pb-10 px-4 sm:px-20 relative" id="contact">
			<div className="h-48 mb-0 overflow-hidden">
				<SpotlightReverse/>
			</div>

			<div className="w-full absolute left-0 -bottom-72 min-h-96 pointer-events-none">
				<Image
					src="/footer-grid.svg"
					alt="grid"
					width={1000}
					height={1000}
					className="w-full h-full opacity-70"
				/>
			</div>

			<div className="flex flex-col items-center max-w-screen-xl mx-auto w-full md:px-4">
				<h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold mb-12">
					<span className="primary-text-gradient">Never Miss a Remote Job</span>
				</h1>

				<p className="max-w-3xl text-xl pb-12">
					Sign up free to get the latest remote openings—filtered by your favorite categories—straight to your inbox.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Link href="/jobs">
						<LitButton
							title="Browse Jobs"
							icon={<IconBriefcase/>}
							position="right"
						/>
					</Link>

					<Link href="/sign-up">
						<LitButton
							title="Sign Up Free"
							icon={<IconSend/>}
							position="right"
						/>
					</Link>
				</div>
			</div>

			<p className="mt-12 md:text-base text-sm md:font-normal font-light">Copyright © 2026 OpenLyst</p>
		</footer>
	)
}

export default Footer;