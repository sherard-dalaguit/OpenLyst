import { model, models, Schema, Types, Document } from "mongoose";

export interface ISavedSearch {
	user: Types.ObjectId;
	name: string; // i.e. "React Roles"
	filters: {
		locations?: string[];
		techStack?: string[];
		jobTypes?: string[];
		sources?: Types.ObjectId[];
	};
}

export interface ISavedSearchDoc extends ISavedSearch, Document {}
const SavedSearchSchema = new Schema<ISavedSearch>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
		filters: {
			locations: { type: [String], default: [] },
			techStack: { type: [String], default: [] },
			jobTypes: { type: [String], default: [] },
			sources: [{ type: Schema.Types.ObjectId, ref: "Source" }],
		},
	},
	{ timestamps: true }
);

const SavedSearch = models?.SavedSearch || model<ISavedSearch>("SavedSearch", SavedSearchSchema);

export default SavedSearch;