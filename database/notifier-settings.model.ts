import { model, models, Schema, Document } from "mongoose";

export interface INotifierSettings {
  key: string; // always "singleton"
  mode: "v1" | "v2";
  gateMode: "strict_allowlist" | "wide_net";
  strictRemoteOnly: boolean;
  homeLocations: string[];
  freshnessDays: number;
  quietHours: { start: string; end: string; tz: string } | null;
  enabledCompanyIds: string[];
}

export interface INotifierSettingsDoc extends INotifierSettings, Document {}

const NotifierSettingsSchema = new Schema<INotifierSettings>(
  {
    key: { type: String, required: true, unique: true, default: "singleton" },
    mode: { type: String, enum: ["v1", "v2"], required: true, default: "v1" },
    gateMode: {
      type: String,
      enum: ["strict_allowlist", "wide_net"],
      required: true,
      default: "wide_net",
    },
    strictRemoteOnly: { type: Boolean, default: false },
    homeLocations: { type: [String], default: [] },
    freshnessDays: { type: Number, default: 3 },
    quietHours: {
      type: {
        start: { type: String },
        end: { type: String },
        tz: { type: String },
      },
      default: null,
    },
    enabledCompanyIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

const NotifierSettings =
  models?.NotifierSettings ||
  model<INotifierSettings>("NotifierSettings", NotifierSettingsSchema);

export default NotifierSettings;
