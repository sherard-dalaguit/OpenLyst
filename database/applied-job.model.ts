import { model, models, Schema, Types, Document } from "mongoose";

export interface IAppliedJob {
	user: Types.ObjectId;
	job: Types.ObjectId;
	status?: "applied" | "interviewing" | "offer" | "rejected" | "accepted";
}

export interface IAppliedJobDoc extends IAppliedJob, Document {}
const AppliedJobSchema = new Schema<IAppliedJob>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
		status: { type: String, enum: ["applied", "interviewing", "offer", "rejected", "accepted"], default: "applied" },
	},
	{ timestamps: true }
);

const AppliedJob = models?.AppliedJob || model<IAppliedJob>("AppliedJob", AppliedJobSchema);

export default AppliedJob;