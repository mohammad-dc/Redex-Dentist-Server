import mongoose from "mongoose";
import BreakSchema from "./break.model";

const DaySchema = new mongoose.Schema(
  {
    time: [String],
    vacation: { type: Boolean, default: false },
    break: { type: BreakSchema, default: { note: "", active: false } },
  },
  { timestamps: false, versionKey: false, _id: false }
);

export default DaySchema;
