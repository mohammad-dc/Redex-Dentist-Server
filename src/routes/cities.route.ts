import { Router } from "express";

import { checkRequestValidation } from "../middlewares/requestValidation";
import { CitiesServices } from "../services/cities.service";
import { citiesSchema } from "../validations/cities.validation";

export const citiesRouter = Router({ mergeParams: true });
const citiesService = new CitiesServices();

citiesRouter.post(
  "/add",
  checkRequestValidation(citiesSchema),
  citiesService.addCity
);

citiesRouter.get("/", citiesService.getCities);
