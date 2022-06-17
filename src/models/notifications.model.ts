import mongoose from "mongoose";

const NotificationsSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    notice_type: {
      type: String,
      required: true,
    },
    receiver: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    read_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { timestamps: true }
);

NotificationsSchema.post("save", () => {
  console.info("Mongo", "Checkout the Notifications we just saved: ", this);
});

NotificationsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model("Notifications", NotificationsSchema);
