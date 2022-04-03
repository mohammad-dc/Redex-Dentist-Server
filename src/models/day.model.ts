import mongoose from "mongoose";
import BreakSchema from "./break.model";

const DaySchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    vacation: { type: Boolean, default: false },
    break: BreakSchema,
  },
  { timestamps: false, versionKey: false, _id: false }
);

export default DaySchema;
