import { Router } from "express";

import { checkRequestValidation } from "../middlewares/requestValidation";
import { CitiesServices } from "../services/cities.service";
import { citiesSchema } from "../validations/cities.validation";

export const citiesRouter = Router({ mergeParams: true });
const citiesService = new CitiesServices();

//users
citiesRouter.post(
  "/add",
  checkRequestValidation(citiesSchema),
  citiesService.addCity
);

citiesRouter.get("/", citiesService.getCities);

//admin
citiesRouter.get("/admin/details", citiesService.getCitiesDetails);

citiesRouter.put("/admin/:action/:_id", citiesService.activationCity);
