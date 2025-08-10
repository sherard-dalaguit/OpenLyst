import { fetchHandler } from "./handlers/fetch";
import { IUser } from "@/database/user.model";
import { IAccount } from "@/database/account.model";
import ROUTES from "@/constants/routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
	auth: {
		oAuthSignIn: ({
			user,
			provider,
			providerAccountId
		}: SignInWithOAuthParams) =>
			fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
				method: "POST",
				body: JSON.stringify({ user, provider, providerAccountId }),
			}),
	},
	users: {
		getAll: () => fetchHandler(`${API_BASE_URL}/users`),
		getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
		getByEmail: (email: string) =>
			fetchHandler(`${API_BASE_URL}/users/email`, {
				method: "POST",
				body: JSON.stringify({ email }),
			}),
		create: (userData: Partial<IUser>) =>
			fetchHandler(`${API_BASE_URL}/users`, {
				method: "POST",
				body: JSON.stringify(userData),
			}),
		update: (id: string, userData: Partial<IUser>) =>
			fetchHandler(`${API_BASE_URL}/users/${id}`, {
				method: "PUT",
				body: JSON.stringify(userData),
			}),
		delete: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`, { method: "DELETE" }),
	},
	accounts: {
		getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
		getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
		getByProvider: (providerAccountId: string) =>
			fetchHandler(`${API_BASE_URL}/accounts/provider`, {
				method: "POST",
				body: JSON.stringify({ providerAccountId }),
			}),
		create: (accountData: Partial<IAccount>) =>
			fetchHandler(`${API_BASE_URL}/accounts`, {
				method: "POST",
				body: JSON.stringify(accountData),
			}),
		update: (id: string, accountData: Partial<IAccount>) =>
			fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
				method: "PUT",
				body: JSON.stringify(accountData),
			}),
		delete: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`, { method: "DELETE" }),
	},
	cron: {
		dailyDigest: () =>
			fetchHandler(`${API_BASE_URL}/cron/daily`, {
				method: "GET",
			}),
		weeklyDigest: () =>
			fetchHandler(`${API_BASE_URL}/cron/weekly`, {
				method: "GET",
			}),
	},
	run_tests: {
		runJavascriptJobsScraper: () =>
			fetchHandler(`${API_BASE_URL}/run-tests/javascriptjobs`, {
				method: "GET",
			}),
		runJobspressoScraper: () =>
			fetchHandler(`${API_BASE_URL}/run-tests/jobspresso`, {
				method: "GET",
			}),
		runRemoteOkScraper: () =>
			fetchHandler(`${API_BASE_URL}/run-tests/remoteok`, {
				method: "GET",
			}),
		runRemotiveScraper: () =>
			fetchHandler(`${API_BASE_URL}/run-tests/remotive`, {
				method: "GET",
			}),
		runSkipTheDriveScraper: () =>
			fetchHandler(`${API_BASE_URL}/run-tests/skipthedrive`, {
				method: "GET",
			}),
		runWeWorkRemotelyScraper: () =>
			fetchHandler(`${API_BASE_URL}/run-tests/weworkremotely`, {
				method: "GET",
			}),
		runWorkingNomadsScraper: () =>
			fetchHandler(`${API_BASE_URL}/run-tests/workingnomads`, {
				method: "GET",
			}),
	},
	settings: {
		updateAlerts: (userId: string, receiveAlerts: boolean) =>
			fetchHandler(`${API_BASE_URL}/settings/receive-alerts`, {
				method: "PUT",
				body: JSON.stringify({ userId, receiveAlerts }),
			}),
		updatePreferences: (userId: string, categories: string[], frequency: 'daily' | 'weekly') =>
			fetchHandler(`${API_BASE_URL}/settings/preferences`, {
				method: "PUT",
				body: JSON.stringify({ userId, categories, frequency }),
			}),
	}
}