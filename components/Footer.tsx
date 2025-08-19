import {SpotlightReverse} from "@/components/ui/spotlight-reverse";
import {IconSend} from "@tabler/icons-react";
import Image from "next/image";
import {socialMedia} from "@/data";
import LitButton from "@/components/ui/LitButton";

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
				<LitButton
					title="Create Job Alert"
					icon={<IconSend/>}
					position="right"
				/>
			</div>

			<div className="flex mt-16 md:flex-row flex-col max-w-screen-xl mx-auto justify-between items-center">
				<p className="md:text-base text-sm md:font-normal font-light">Copyright © 2025 Remote Radar</p>

				<div className="flex items-center justify-center md:gap-3 gap-6 mt-5">
					{socialMedia.map((profile) => (
						<a key={profile.id} href={profile.link} target="_blank" rel="noopener noreferrer">
							<div className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300">
								<Image
									src={profile.img}
									alt={profile.img}
									width={20}
									height={20}
								/>
							</div>
						</a>
					))}
				</div>
			</div>
		</footer>
	)
}

export default Footer;