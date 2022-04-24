import { usersRoles } from "../enums/auth.enum";

export interface IDrRegister {
  name: string;
  phone: string;
  password: string;
  city: string;
  address: string;
  clinic_name: string;
  role: usersRoles.DR;
}

export interface IPatientRegister {
  name: string;
  phone: string;
  password: string;
  city: string;
  address: string;
  role: usersRoles.PATIENT;
}
