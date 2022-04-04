import * as yup from "yup";
import messages from "./messages";

export const citiesSchema = yup.object().shape({
  city: yup.string().required(messages.requiredField("city")),
});
