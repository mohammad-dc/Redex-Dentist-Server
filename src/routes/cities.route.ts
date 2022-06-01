import { Router } from "express";

import { checkRequestValidation } from "../middlewares/requestValidation";
import { CitiesServices } from "../services/cities.service";
import { citiesSchema } from "../validations/cities.validation";

export const citiesRouter = Router({ mergeParams: true });
const citiesService = new CitiesServices();

//users
citiesRouter.get("/", citiesService.getCities);

//admin
citiesRouter.post(
  "/admin/add",
  checkRequestValidation(citiesSchema),
  citiesService.addCity
);

citiesRouter.put(
  "/admin/update/:_id",
  checkRequestValidation(citiesSchema),
  citiesService.updateCity
);

citiesRouter.get("/admin/details", citiesService.getCitiesDetails);

citiesRouter.put(
  "/admin/activation/:action/:_id",
  citiesService.activationCity
);
