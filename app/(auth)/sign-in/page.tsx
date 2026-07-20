import type { Metadata } from "next";
import SignInForm from "@/components/forms/SignInForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const SignIn = () => {
	return <SignInForm />
};

export default SignIn;
