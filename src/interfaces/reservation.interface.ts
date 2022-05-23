import { ReservationsStatusType } from "../@types/reservations.type";

export interface ISaveReservation {
  date: Date;
  created_by: string;
  patient?: string;
  doctor?: string;
  status?: ReservationsStatusType;
}

export interface IUpdateReservation {
  date: Date;
  patient?: string;
  doctor?: string;
  status?: ReservationsStatusType;
}

export interface IReservationMatchFilter {
  patient?: string;
  doctor?: string;
  status?: ReservationsStatusType;
}
