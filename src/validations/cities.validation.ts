import * as yup from "yup";
import messages from "./messages";

export const citiesSchema = yup.object().shape({
  city_ar: yup.string().required(messages.requiredField("city_ar")),
  city_en: yup.string().required(messages.requiredField("city_en")),
});
