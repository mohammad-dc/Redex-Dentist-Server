import mongoose from "mongoose";
import { reservationStatus } from "../enums/auth.enum";

const ReservationsSchema = new mongoose.Schema(
  {
    status: { type: String, default: reservationStatus.PENDING },
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
