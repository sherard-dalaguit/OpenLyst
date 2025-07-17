import { model, models, Schema, Types, Document } from "mongoose";

export interface ISavedJob {
	user: Types.ObjectId;
	job: Types.ObjectId;
}

export interface ISavedJobDoc extends ISavedJob, Document {}
const SavedJobSchema = new Schema<ISavedJob>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
	},
	{ timestamps: true }
);

const SavedJob = models?.SavedJob || model<ISavedJob>("SavedJob", SavedJobSchema);

export default SavedJob;