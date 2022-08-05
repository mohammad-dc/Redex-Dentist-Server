import * as yup from "yup";
import messages from "./messages";

export const sendVerificationCodeSchema = yup.object().shape({
  phone: yup.string().required(messages.requiredField("phone")),
});

export const updateProfileSchema = yup.object().shape({
  name: yup.string().required(messages.requiredField("name")),
  phone: yup.string().required(messages.requiredField("phone")),
  city: yup.string().required(messages.requiredField("city")),
  address: yup.string(),
  clinic_name: yup.string(),
  email: yup.string().email(),
  bio: yup.string(),
});

export const searchDoctorsSchema = yup.object().shape({
  name: yup.string(),
  rate: yup.number(),
  city: yup.string(),
});
