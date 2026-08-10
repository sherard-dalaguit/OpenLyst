import type { Metadata } from "next";
import SignInForm from "@/components/forms/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: true },
  alternates: { canonical: "/sign-in" },
};

const SignIn = () => {
	return <SignInForm />
};

export default SignIn;
