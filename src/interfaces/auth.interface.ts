import { usersRoles } from "../enums/auth.enum";

export interface IDoctorRegister {
  name: string;
  phone: string;
  password: string;
  city: string;
  address: string;
  clinic_name: string;
  role: usersRoles.DOCTOR;
}

export interface IPatientRegister {
  name: string;
  phone: string;
  password: string;
  city: string;
  address: string;
  role: usersRoles.PATIENT;
}
