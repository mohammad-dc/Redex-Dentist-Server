import mongoose from "mongoose";

const BreakSchema = new mongoose.Schema(
  {
    note: { type: String, default: "" },
    active: { type: Boolean, default: false },
  },
  { timestamps: false, versionKey: false, _id: false }
);

export default BreakSchema;
