export interface ISaveReservation {
  date: Date;
  created_by: string;
  patient?: string;
  doctor?: string;
  accepted?: boolean;
}

export interface IUpdateReservation {
  date: Date;
  patient?: string;
  doctor?: string;
  accepted?: boolean;
}

export interface IReservationMatchFilter {
  patient?: string;
  doctor?: string;
  accepted?: boolean;
}
