import { model, models, Schema, Types, Document } from "mongoose";

export interface IJob {
  title: string;
	companyId: Types.ObjectId;
  location?: string;
  salaryRange?: string;
  jobType: string;
  sourceId: Types.ObjectId;
	sourceLink: string;
}

export interface IJobDoc extends IJob, Document {}
const JobSchema = new Schema<IJob>(
	{
		title: { type: String, required: true },
		companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
		location: { type: String },
		salaryRange: { type: String },
		jobType: { type: String, required: true },
		sourceId: { type: Schema.Types.ObjectId, ref: "Source", required: true },
		sourceLink: { type: String, required: true }
	},
	{ timestamps: true }
)

const Job = models?.Job || model<IJob>("Job", JobSchema);

export default Job;