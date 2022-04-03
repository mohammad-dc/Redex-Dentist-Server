import mongoose from "mongoose";
import DaySchema from "./day.model";

const WorkTimeSchema = new mongoose.Schema(
  {
    saturday: DaySchema,
    sunday: DaySchema,
    monday: DaySchema,
    tuesday: DaySchema,
    wednesday: DaySchema,
    thursday: DaySchema,
    friday: DaySchema,
  },
  { timestamps: false, versionKey: false, _id: false }
);

export default WorkTimeSchema;
