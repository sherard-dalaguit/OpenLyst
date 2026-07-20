import type { Metadata } from "next";
import SignUpForm from "@/components/forms/SignUpForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const SignUp = () => {
	return <SignUpForm />
};

export default SignUp;
