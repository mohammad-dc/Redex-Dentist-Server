import { Request, Response, NextFunction } from "express";
import response from "../helpers/response";
import body from "../helpers/response/body";
import citiesModel from "../models/cities.model";

export class CitiesServices {
  async addCity(req: Request, res: Response, next: NextFunction) {
    const { city } = req.body;

    const _cities = new citiesModel({ city });

    try {
      await _cities.save();
      response.addedSuccess(res);
    } catch (error) {
      response.somethingWentWrong(res, error as Error);
    }
  }

  async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await citiesModel.find({}, body.CITIES);
      response.getSuccess(res, results, results.length);
    } catch (error) {
      response.somethingWentWrong(res, error as Error);
    }
  }
}
