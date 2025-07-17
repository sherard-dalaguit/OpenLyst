import { model, models, Schema, Document } from "mongoose";

export interface ISource {
	name: string;
	baseUrl: string;
	apiEndpoint?: string;
}

export interface ISourceDoc extends ISource, Document {}
const SourceSchema = new Schema<ISource>(
	{
		name: { type: String, required: true, unique: true },
		baseUrl: { type: String, required: true },
		apiEndpoint: { type: String },
	},
	{ timestamps: true }
);

const Source = models?.Source || model<ISource>("Source", SourceSchema);

export default Source;