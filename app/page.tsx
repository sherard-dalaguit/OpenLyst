import LitButton from '@/components/ui/LitButton';
import { IconBriefcase, IconSend } from '@tabler/icons-react';
import {Spotlight} from "@/components/ui/spotlight";
import Image from 'next/image';
import Footer from "@/components/Footer";
import {LandingNavbar} from "@/components/navigation/LandingNavbar";
import {Services} from "@/components/Services";
import Link from "next/link";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <div className="relative flex flex-col items-center justify-center text-center overflow-clip bg-black mx-auto pt-[21vh] sm:pt-[32vh]">
				<section className="min-h-screen flex flex-col items-center">
					<Spotlight/>

					<div className="w-full absolute left-0 top-0 min-h-96 pointer-events-none rotate-180">
						<Image
							src="/footer-grid.svg"
							alt="grid"
							width={1000}
							height={1000}
							className="w-full h-full opacity-40 dark:opacity-70 filter invert dark:filter-none"
						/>
					</div>

					<h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl max-w-6xl font-semibold">
						Turn your <span className="primary-text-gradient">inbox</span> into the ultimate <span className="primary-text-gradient">remote board</span>
					</h1>

					<p className="text-lg md:text-xl lg:text-2xl px-4 max-w-4xl my-16">
						Remote Radar pulls in hundreds of remote job listings from around the web and sends them to your inbox every day.
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
				</section>

				<div className="mx-6 md:mx-10 -mt-[30vh] mb-[22vh] max-w-6xl p-[4px] z-50 bg-gradient-to-r from-[#843cf3] via-[#d73ed7] to-[#ff8f5d] rounded-2xl">
					<Image
						src="/screenshots/remote_radar.webp"
						alt="hero"
						height={720}
						width={1400}
						className="rounded-2xl object-cover h-full object-left-top"
						draggable={false}
					/>
				</div>

        <h1 className="text-4xl md:text-5xl xl:text-6xl max-w-6xl font-semibold">
          Everything you need for a <span className="primary-text-gradient">winning remote job search</span>
        </h1>

        <div className="text-start w-full">
          <Services />
					<FAQ />
        </div>

				<Footer />
      </div>
    </>
  );
}
