import { model, models, Schema, Types, Document } from "mongoose";

export interface ITagJob {
	tag: Types.ObjectId;
	job: Types.ObjectId;
}

export interface ITagJobDoc extends ITagJob, Document {}
const TagJobSchema = new Schema<ITagJob>(
	{
		tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
		job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
	},
	{ timestamps: true }
);

const TagJob = models?.TagJob || model<ITagJob>("TagJob", TagJobSchema);

export default TagJob;