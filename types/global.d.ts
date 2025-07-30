type ActionResponse<T = null> = {
	success: boolean;
	data?: T;
	error?: {
		message: string;
		details?: Record<string, string[]>;
	},
	status?: number;
}

interface SourceType {
	name: string;
	baseUrl: string;
	apiEndpoint?: string;
}

interface User {
	_id: string;
	name: string;
}

interface JobType {
	_id: string;
	sourceJobId: string;
	title: string;
	companyName: string;
	location?: string;
	category?: string;
	experienceLevel?: string;
	description?: string;
	salaryMin?: number;
	salaryMax?: number;
	jobType: string;
	sourceId: SourceType;
	sourceLink: string;
	sourceName: string;
	isBookmarked: boolean;
	isApplied: boolean;
	postedAt: Date;
}

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
	params: Promise<Record<string, string>>;
	searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
	page?: number;
	pageSize?: number;
	query?: string;
	filter?: string;
	sort?: string;
}

interface JobSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  jobType?: string;
  experienceLevel?: string;
  category?: string;
	source?: string;
  salary?: number;
  datePosted?: string;
  sort?: string;
}

interface SavedJobParams {
	jobId: string;
}

interface ApplyJobParams {
	jobId: string;
}

interface SaveJobType {
	_id: string;
	user: string | User;
	job: JobType;
}

interface ApplyJobType {
	_id: string;
	user: string | User;
	job: JobType;
}