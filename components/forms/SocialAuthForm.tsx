import {Button} from "@/components/ui/button";
import Image from "next/image";

const SocialAuthForm = () => {
	const buttonClass = "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-[8px] px-4 py-3.5";
	return (
		<div className="mt-10 flex flex-wrap gap-2.5">
			<Button className={buttonClass}>
				<Image
					src="/icons/linkedin.svg"
					alt="LinkedIn Logo"
					width={20}
					height={20}
					className="mr-2.5 object-contain"
				/>
				<span>Log in with LinkedIn</span>
			</Button>
			<Button className={buttonClass}>
				<Image
					src="/icons/google.svg"
					alt="Google Logo"
					width={20}
					height={20}
					className="mr-2.5 object-contain"
				/>
				<span>Log in with Google</span>
			</Button>
		</div>
	)
};

export default SocialAuthForm;