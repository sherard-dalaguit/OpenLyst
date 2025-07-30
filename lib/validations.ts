import { z } from 'zod';

export const SignInSchema = z.object({
	email: z
		.string()
		.min(1, {message: 'Email is required'})
		.email({message: 'Please provide a valid email address.'}),

	password: z
		.string()
		.min(6, {message: 'Password must be at least 6 characters long.'})
		.max(100, {message: 'Password cannot exceed 100 characters.'}),
})

export const SignUpSchema = z.object({
	name: z
		.string()
		.min(1, {message: 'Name is required.'})
		.max(50, {message: 'Name cannot exceed 50 characters.'})
		.regex(/^[a-zA-Z\s]+$/, {
			message: 'Name can only contain letters and spaces.',
		}),

	email: z
		.string()
		.min(1, {message: 'Email is required'})
		.email({message: 'Please provide a valid email address.'}),

	password: z
		.string()
		.min(6, {message: 'Password must be at least 6 characters long.'})
		.max(100, {message: 'Password cannot exceed 100 characters.'})
		.regex(/[A-Z]/, {
			message: 'Password must contain at least one uppercase letter.',
		})
		.regex(/[a-z]/, {
			message: 'Password must contain at least one lowercase letter.',
		})
		.regex(/[0-9]/, {
			message: 'Password must contain at least one number.',
		})
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Password must contain at least one special character.',
		}),
})

export const UserSchema = z.object({
	name: z
		.string()
		.min(1, {message: 'Name is required'})
		.max(50, {message: 'Name cannot exceed 50 characters.'}),
	email: z
		.string()
		.email({message: 'Please provide a valid email address.'}),
	image: z
		.string()
		.url({message: 'Image must be a valid URL.'})
		.optional(),
	reputation: z
		.string()
		.optional(),
})

export const AccountSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid image URL").optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
});

export const SignInWithOAuthSchema = z.object({
	provider: z.enum(['google', 'github']),
	providerAccountId: z.string().min(1, {message: 'Provider account ID is required'}),
	user: z.object({
		name: z.string().min(1, {message: 'Name is required'}),
		email: z.string().email({message: 'Please provide a valid email address.'}),
		image: z.string().url({message: 'Image must be a valid URL.'}).optional(),
	})
})

export const PaginatedSearchParamsSchema = z.object({
	page: z.number().int().positive().default(1),
	pageSize: z.number().int().positive().default(10),
	query: z.string().optional(),
	filter: z.string().optional(),
	sort: z.string().optional(),
})

export const GetJobSchema = z.object({
	jobId: z.string().min(1, { message: 'Job ID is required' }),
})

export const JobSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  jobType: z.string().optional(),
  experienceLevel: z.string().optional(),
  category: z.string().optional(),
	source: z.string().optional(),
  salary: z.number().int().nonnegative().optional(),
  datePosted: z.enum(["24h","3d","7d","14d","30d","60d","90d","anytime"]).optional(),
  sort: z.enum(["newest","oldest"]).default("newest"),
});

export const SavedJobSchema = z.object({
	jobId: z.string().min(1, { message: 'Job ID is required' }),
})

export const AppliedJobSchema = z.object({
	jobId: z.string().min(1, { message: 'Job ID is required' }),
})