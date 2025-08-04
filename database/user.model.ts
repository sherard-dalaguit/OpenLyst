import { model, models, Schema, Document } from "mongoose";
import {nanoid} from "zod";

export interface Preferences {
  receiveAlerts: boolean;
  categories: string[];
  frequency: "daily" | "weekly";
  lastSentAt?: Date;
  unsubscribeToken: string;
}

export interface IUser {
  name: string;
  email: string;
  image?: string;
  reputation?: number;
  preferences: Preferences;
}

export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    reputation: { type: Number, default: 0 },
    preferences: {
      receiveAlerts: {
        type: Boolean,
        default: true
      },
      categories: {
        type: [String],
        default: [
          "software_engineering",
          "data",
          "product_management",
          "design",
          "marketing",
          "sales",
          "customer_support",
          "devops",
          "quality_assurance",
          "operations",
          "other"
        ]
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly"],
        default: "daily"
      },
      lastSentAt: Date,
      unsubscribeToken: {
        type: String,
        required: true,
        default: () => nanoid()
      }
    }
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;