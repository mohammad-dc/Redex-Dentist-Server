import mongoose from "mongoose";

const CitiesSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

CitiesSchema.post("save", () => {
  console.info("Mongo", "Checkout the Cities we just saved: ", this);
});

export default mongoose.model("Cities", CitiesSchema);
