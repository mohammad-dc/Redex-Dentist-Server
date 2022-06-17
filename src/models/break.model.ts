import mongoose from "mongoose";

const BreakSchema = new mongoose.Schema(
  {
    note: { type: String, default: "" },
    time: [Date],
    active: { type: Boolean, default: false },
  },
  { timestamps: false, versionKey: false, _id: false }
);

export default BreakSchema;
