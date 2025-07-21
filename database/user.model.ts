import { model, models, Schema, Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  image?: string;
  reputation?: number;
}

export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;