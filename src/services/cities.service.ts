import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import response from "../helpers/response";
import body from "../helpers/response/body";
import { ICityResponse } from "../interfaces/cities.interface";
import citiesModel from "../models/cities.model";
import sockets from "../utils/socket/sockets";

export class CitiesServices {
  //users
  async getCities(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    try {
      const results = await citiesModel
        .aggregate([])
        .match({ active: true })
        .project({
          _id: "$_id",
          city: lang === "ar" ? "$city_ar" : "$city_en",
        });
      response.getSuccess(res, results, results.length);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  //admin
  async addCity(req: Request, res: Response, next: NextFunction) {
    const { city_ar, city_en } = req.body;

    const _city = new citiesModel({ city_ar, city_en });

    try {
      const { _id, city_ar, city_en, active } = await _city.save();
      const data: ICityResponse = { _id, city_ar, city_en, active };
      sockets.citiesSocket({ type: "add", data });
      response.addedSuccess("ar", res);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }

  async updateCity(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.params;
    const { city_ar, city_en } = req.body;

    try {
      const result = await citiesModel.findByIdAndUpdate(
        { _id },
        { city_ar, city_en }
      );
      const data: ICityResponse = {
        _id,
        city_ar,
        city_en,
        active: result.active,
      };
      sockets.citiesSocket({ type: "edit", data });
      response.updatedSuccess("ar", res);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }

  async getCitiesDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await citiesModel.aggregate([]).project({
        _id: "$_id",
        city_ar: "$city_ar",
        city_en: "$city_en",
        active: "$active",
      });
      response.getSuccess(res, results, results.length);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }

  async activationCity(req: Request, res: Response, next: NextFunction) {
    const { _id, action } = req.params;

    try {
      const result = await citiesModel.findByIdAndUpdate(
        { _id },
        { active: action === "activate" ? true : false }
      );
      result
        ? response.updatedSuccess("ar", res)
        : response.itemNotExist("ar", res);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }
}
