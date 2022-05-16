import * as yup from "yup";
import messages from "./messages";

export const adminSchema = yup.object().shape({
  email: yup.string().email().required(messages.requiredField("email")),
  password: yup.string().required(messages.requiredField("password")),
});
