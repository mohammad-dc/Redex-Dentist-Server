import { reservationStatus } from "../enums/auth.enum";

export type ReservationsStatusType =
  | reservationStatus.APPROVED
  | reservationStatus.DECLINED
  | reservationStatus.CANCELED
  | reservationStatus.PENDING;
