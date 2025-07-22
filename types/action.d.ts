interface SignInWithOAuthParams {
	provider: 'github' | 'google';
	providerAccountId: string;
	user: {
		name: string;
		email: string;
		image: string;
	};
}

interface AuthCredentials {
	name: string;
	email: string;
	password: string;
}