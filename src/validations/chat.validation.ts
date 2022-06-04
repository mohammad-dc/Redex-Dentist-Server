import * as yup from "yup";
import messages from "./messages";

export const chatSchema = yup.object().shape({
  user: yup.string().required(messages.requiredField("user")),
  message: yup.string().required(messages.requiredField("message")),
});
