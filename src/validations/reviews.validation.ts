import * as yup from "yup";
import messages from "./messages";

export const reviewsSchema = yup.object().shape({
  rate: yup.number().required(messages.requiredField("rate")),
  doctor: yup.string().required(messages.requiredField("doctor")),
  note: yup.string(),
});
