import { Request, Response, NextFunction } from "express";
import response from "../helpers/response";
import body from "../helpers/response/body";
import citiesModel from "../models/cities.model";

const addCity = (req: Request, res: Response, next: NextFunction) => {
  const { city } = req.body;

  const _cities = new citiesModel({ city });

  _cities
    .save()
    .then(() => response.addedSuccess(res))
    .catch((error: Error) => response.somethingWentWrong(res, error));
};

const getCities = (req: Request, res: Response, next: NextFunction) => {
  citiesModel
    .find({}, body.CITIES)
    .then((results) => response.getSuccess(res, results, results.length))
    .catch((error) => response.somethingWentWrong(res, error));
};

export default { addCity, getCities };
