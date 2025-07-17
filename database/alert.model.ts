import { model, models, Schema, Document } from "mongoose";

export interface IAlert {
	name: string;
	savedSearch: Types.ObjectId;
	frequency: "daily" | "weekly";
}

export interface IAlertDoc extends IAlert, Document {}
const AlertSchema = new Schema<IAlert>(
	{
		name: { type: String, required: true, unique: true },
		savedSearch: { type: Schema.Types.ObjectId, ref: "SavedSearch", required: true },
		frequency: { type: String, enum: ["daily", "weekly"], default: "daily", required: true },
	},
	{ timestamps: true }
);

const Alert = models?.Alert || model<IAlert>("Alert", AlertSchema);

export default Alert;