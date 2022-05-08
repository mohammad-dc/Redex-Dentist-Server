import mongoose from "mongoose";

const ReservationsSchema = new mongoose.Schema(
  {
    accepted: { type: Boolean, default: false },
    status: { type: String, default: "none" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    date: { type: Date, required: true },
    note: { type: String },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReservationsSchema.post("save", () => {
  console.info("Mongo", "Checkout the Reservations we just saved: ", this);
});

export default mongoose.model("Reservations", ReservationsSchema);
