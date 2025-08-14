import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
	return (
		<footer className="relative w-full p-10 lg:px-[10vh] flex flex-col space-y-8 border-t border-[#171717] bg-[#070707]" id="contact">
			<div className="flex flex-col sm:flex-row mx-auto w-full max-w-7xl xl:max-w-[70vw] justify-around sm:items-center">
				<div className="flex flex-col sm:pt-10 sm:gap-2">
					<Link
						href="#"
						className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 font-normal text-black"
					>
						<Image
							src="/logo.png"
							alt="logo"
							width={30}
							height={30}
						/>
						<span className="font-medium primary-text-gradient">Remote Radar</span>
					</Link>

					<div className="text-neutral-300 p-2 space-y-2">
						<p>Copyright @ 2025 Remote Radar</p>
						<p>All rights reserved</p>
					</div>
				</div>

				<div className="flex flex-row space-x-20 pt-10 text-xs sm:text-sm text-neutral-300">
					<div className="flex flex-col gap-4">
						<p>Pricing</p>
						<p>Blog</p>
						<p>Contact</p>
					</div>

					<div className="flex flex-col gap-4">
						<p>Privacy Policy</p>
						<p>Terms of Service</p>
						<p>Refund Policy</p>
					</div>

					<div className="flex flex-col gap-4">
						<p>Twitter</p>
						<p>LinkedIn</p>
						<p>GitHub</p>
					</div>
				</div>
			</div>
			<h1 className="mx-auto text-[40px] sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[160px] font-bold primary-text-gradient">
				Remote Radar
			</h1>
		</footer>
	)
}

export default Footer;