import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
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
