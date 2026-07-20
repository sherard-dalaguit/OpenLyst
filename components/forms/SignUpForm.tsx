"use client"

import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/validations";
import { signUpWithCredentials } from "@/lib/actions/auth.action";

// Client wrapper so the Zod schema never crosses the server->client prop
// boundary (class instances aren't serializable as RSC props).
const SignUpForm = () => (
	<AuthForm
		formType="SIGN_UP"
		schema={SignUpSchema}
		defaultValues={{ name: "", email: "", password: "" }}
		onSubmit={signUpWithCredentials}
	/>
);

export default SignUpForm;
