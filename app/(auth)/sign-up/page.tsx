import type { Metadata } from "next";
import AuthForm from "@/components/forms/AuthForm";
import {SignUpSchema} from "@/lib/validations";
import {signUpWithCredentials} from "@/lib/actions/auth.action";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.openlyst.io/sign-up",
  },
};

const SignUp = () => {
	return (
		<AuthForm
			formType="SIGN_UP"
			schema={SignUpSchema}
			defaultValues={{ name: "", email: "", password: "" }}
			onSubmit={signUpWithCredentials}
		/>
	)
};

export default SignUp;