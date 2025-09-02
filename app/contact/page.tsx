import {Spotlight} from "@/components/ui/spotlight";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {auth} from "@/auth";

const Contact = async () => {
	const session = await auth();
	const userId = session?.user?.id;

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
				<div className="space-y-2.5">
					<h1 className="h2-bold text-dark100_light900">Get in Touch</h1>
					<p className="paragraph-regular text-dark500_light400">
						Have a question, feedback, or just want to say hello? We’d love to hear from you.
					</p>
					<p className="paragraph-regular text-dark500_light400">
						You can reach us anytime at
						{" "}<a href="mailto:support@nomadlyst.com" className="primary-text-gradient">
							support@nomadlyst.com
						</a>.
					</p>
				</div>
				<div className="mt-8 flex justify-center">
					<Button className="primary-gradient">
						<Link href="/jobs">Return to Nomadlyst</Link>
					</Button>
				</div>
			</section>
		</main>
	)
}

export default Contact;