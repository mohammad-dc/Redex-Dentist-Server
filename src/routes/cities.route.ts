import { Router } from "express";
import citiesController from "../controllers/cities.controller";
import { checkRequestValidation } from "../middlewares/requestValidation";
import { citiesSchema } from "../validations/cities.validation";

export const citiesRouter = Router();

citiesRouter.post(
  "/add",
  checkRequestValidation(citiesSchema),
  citiesController.addCity
);

citiesRouter.get("/get", citiesController.getCities);
