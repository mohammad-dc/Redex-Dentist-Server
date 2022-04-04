import mongoose from "mongoose";
import WorkTimeSchema from "./workTime.model";

const UsersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    clinic_name: {
      type: String,
    },
    role: {
      type: String,
      default: "patient",
    },
    image_url: {
      type: String,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cities",
    },
    address: {
      type: String,
      required: true,
    },
    work_time: WorkTimeSchema,
  },
  { timestamps: true }
);

UsersSchema.post("save", () => {
  console.info("Mongo", "Checkout the Users we just saved: ", this);
});

export default mongoose.model("Users", UsersSchema);
