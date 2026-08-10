import type { Metadata } from "next";
import SignUpForm from "@/components/forms/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: true },
  alternates: { canonical: "/sign-up" },
};

const SignUp = () => {
	return <SignUpForm />
};

export default SignUp;
