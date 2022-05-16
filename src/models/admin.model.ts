import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

AdminSchema.post("save", () => {
  console.info("Mongo", "Checkout the Admin we just saved: ", this);
});

export default mongoose.model("Admin", AdminSchema);
