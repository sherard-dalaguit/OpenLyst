import { model, models, Schema, Types, Document } from "mongoose";

export interface IInteraction {
	user: Types.ObjectId;
	action: string;
	actionId: Types.ObjectId;
	actionType: "job";
}

export const InteractionActionEnums = [
	"view",
	"apply",
	"save",
	"search"
] as const;

export interface IInteractionDoc extends IInteraction, Document {}
const InteractionSchema = new Schema<IInteraction>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		action: { type: String, enum: InteractionActionEnums, required: true },
		actionId: { type: Schema.Types.ObjectId, required: true },
		actionType: { type: String, enum: ["job"], required: true },
	},
	{ timestamps: true }
);

const Interaction = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;