const ROUTES = {
	HOME: "/jobs",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	APPLIED_JOBS: "/applied-jobs",
	SAVED_JOBS: "/saved-jobs",
	TAGS: "/tags",
	PROFILE: (id: string) => `/profile/${id}`,
	QUESTION: (id: string) => `/questions/${id}`,
	TAG: (id: string) => `/tags/${id}`,
	SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
};

export default ROUTES;