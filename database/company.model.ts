import { model, models, Schema, Types, Document } from "mongoose";

export interface ICompany {
  name: string;
  logoUrl?: string;
	size?: string;
  website?: string;
  remoteRating?: number;
  description?: string;
}

export interface ICompanyDoc extends ICompany, Document {}
const CompanySchema = new Schema<ICompany>(
	{
		name: { type: String, required: true, unique: true },
		logoUrl: { type: String },
		size: { type: String },
		website: { type: String },
		remoteRating: { type: Number, default: 0 },
		description: { type: String },
	},
	{ timestamps: true }
)

const Company = models?.Company || model<ICompany>("Company", CompanySchema);

export default Company;