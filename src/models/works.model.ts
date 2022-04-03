import mongoose from "mongoose";

const WorksSchema = new mongoose.Schema(
  {
    dr: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    image_url: { type: String, required: true },
  },
  { timestamps: true }
);

WorksSchema.post("save", () => {
  console.info("Mongo", "Checkout the Works we just saved: ", this);
});

export default mongoose.model("Works", WorksSchema);
