import mongoose from "mongoose";

const ReportsSchema = new mongoose.Schema(
  {
    reason: { type: mongoose.Schema.Types.ObjectId, ref: "ReportsReasons" },
    content: { type: String },
    report_from: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    report_to: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

ReportsSchema.post("save", () => {
  console.info("Mongo", "Checkout the Reports we just saved: ", this);
});

export default mongoose.model("Reports", ReportsSchema);
