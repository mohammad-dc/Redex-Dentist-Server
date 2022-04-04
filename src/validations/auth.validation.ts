import * as yup from "yup";
import messages from "./messages";

export const registerSchema = yup.object().shape({
  name: yup.string().required(messages.requiredField("name")),
  phone: yup.string().required(messages.requiredField("phone")),
  password: yup.string().required(messages.requiredField("password")),
  city: yup.string().required(messages.requiredField("city")),
  address: yup.string(),
  clinic_name: yup.string().required(messages.requiredField("clinic_name")),
});

export const loginSchema = yup.object().shape({
  phone: yup.string().required(messages.requiredField("phone")),
  password: yup.string().required(messages.requiredField("password")),
});
