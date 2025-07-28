import { model, models, Schema, Types, Document } from "mongoose";

export interface IJob {
  sourceJobId: string;
  title: string;
  companyName: string;
  location?: string;
  category?: string;
	experienceLevel?: string;
	description?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: string;               // e.g. "Full-Time", "Contract"
  sourceId: Types.ObjectId;      // ref to your Source collection
  sourceLink: string;            // original URL
	sourceName: string;          // name of the source (e.g. "RemoteOK")
	isBookmarked: boolean;
	isApplied: boolean;
  postedAt: Date;
}

export interface IJobDoc extends IJob, Document {}
const JobSchema = new Schema<IJob>(
	{
		sourceJobId: { type: String, required: true },
		title: { type: String, required: true },
		companyName: { type: String, required: true },
		location: { type: String },
		category: { type: String },
		description: { type: String },
		salaryMin: { type: Number },
		salaryMax: { type: Number },
		jobType: { type: String, required: true },
		sourceId: { type: Schema.Types.ObjectId, ref: "Source", required: true },
		sourceLink: { type: String, required: true },
		sourceName: { type: String, required: true },
		isBookmarked: { type: Boolean, default: false },
		isApplied: { type: Boolean, default: false },
		postedAt: { type: Date, required: true },
	},
	{ timestamps: true }
)

// avoid duplicates per board
JobSchema.index({ sourceJobId: 1, sourceId: 1 }, { unique: true });

const Job = models?.Job || model<IJob>("Job", JobSchema);

export default Job;