import * as yup from "yup";
import messages from "./messages";

export const chatSchema = yup.object().shape({
  receiver: yup.string().required(messages.requiredField("receiver")),
  message: yup.string().required(messages.requiredField("message")),
});
