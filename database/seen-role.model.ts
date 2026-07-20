import { model, models, Schema, Document } from "mongoose";

export interface ISeenRole {
  dedupeKey: string; // company-slug::title-slug — identity across sources (FR-9)
  jobId: string; // ATS-native id when available, else hash
  company: string;
  title: string;
  applyUrl: string;
  sourceId: string;
  firstSeenAt: Date;
  alerted: boolean;
  alertedAt?: Date;
  primed?: boolean; // seen during a priming run (never alerted by design)
}

export interface ISeenRoleDoc extends ISeenRole, Document {}

const SeenRoleSchema = new Schema<ISeenRole>(
  {
    dedupeKey: { type: String, required: true, unique: true },
    jobId: { type: String, required: true },
    company: { type: String, required: true },
    title: { type: String, required: true },
    applyUrl: { type: String, required: true },
    sourceId: { type: String, required: true },
    firstSeenAt: { type: Date, required: true },
    alerted: { type: Boolean, default: false },
    alertedAt: { type: Date },
    primed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SeenRole = models?.SeenRole || model<ISeenRole>("SeenRole", SeenRoleSchema);

export default SeenRole;
