import mongoose from "mongoose";

const ReportsReasonsSchema = new mongoose.Schema(
  {
    reason_ar: {
      type: String,
      required: true,
    },
    reason_en: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

ReportsReasonsSchema.post("save", () => {
  console.info("Mongo", "Checkout the ReportsReasons we just saved: ", this);
});

export default mongoose.model("ReportsReasons", ReportsReasonsSchema);
