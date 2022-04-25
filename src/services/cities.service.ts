import { Request, Response, NextFunction } from "express";
import response from "../helpers/response";
import body from "../helpers/response/body";
import citiesModel from "../models/cities.model";

export class CitiesServices {
  async addCity(req: Request, res: Response, next: NextFunction) {
    const { city_ar, city_en } = req.body;

    const _cities = new citiesModel({ city_ar, city_en });

    try {
      await _cities.save();
      response.addedSuccess(res);
    } catch (error) {
      response.somethingWentWrong(res, error as Error);
    }
  }

  async getCities(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    try {
      const results = await citiesModel
        .aggregate([])
        .project({
          _id: "$_id",
          city: lang === "ar" ? "$city_ar" : "$city_en",
        });
      response.getSuccess(res, results, results.length);
    } catch (error) {
      response.somethingWentWrong(res, error as Error);
    }
  }
}
