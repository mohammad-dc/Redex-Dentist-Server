import mongoose from "mongoose";

const BreakSchema = new mongoose.Schema(
  {
    start: { type: Date },
    end: { type: Date },
    open: { type: Boolean },
  },
  { timestamps: false, versionKey: false, _id: false }
);

export default BreakSchema;
