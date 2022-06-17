import { reservationStatus } from "../enums/reservations.enum";

export type ReservationsStatusType =
  | reservationStatus.APPROVED
  | reservationStatus.DECLINED
  | reservationStatus.CANCELED
  | reservationStatus.PENDING;
