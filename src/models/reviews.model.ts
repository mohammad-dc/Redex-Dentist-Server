import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    rate: { type: Number, default: 0 },
    note: { type: String },
  },
  { timestamps: true }
);

ReviewsSchema.post("save", () => {
  console.info("Mongo", "Checkout the Reviews we just saved: ", this);
});

export default mongoose.model("Reviews", ReviewsSchema);
