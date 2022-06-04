import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    sender: { type: String, required: true },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

ChatSchema.post("save", () => {
  console.info("Mongo", "Checkout the Chats we just saved: ", this);
});

export default mongoose.model("Chats", ChatSchema);
