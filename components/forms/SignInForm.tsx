"use client"

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth.action";

// Client wrapper so the Zod schema never crosses the server->client prop
// boundary (class instances aren't serializable as RSC props).
const SignInForm = () => (
	<AuthForm
		formType="SIGN_IN"
		schema={SignInSchema}
		defaultValues={{ email: "", password: "" }}
		onSubmit={signInWithCredentials}
	/>
);

export default SignInForm;
