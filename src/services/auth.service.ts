import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { LangTypes } from "../@types/app.type";
import { usersRoles } from "../enums/auth.enum";
import { comparePassword, hashPassword } from "../functions/bcryptPassword";
import { extractDataFromToken, signJWT } from "../functions/jwt";
import response from "../helpers/response";
import body from "../helpers/response/body";
import {
  IDoctorRegister,
  IPatientRegister,
} from "../interfaces/auth.interface";
import usersModel from "../models/users.model";

export class AuthServices {
  /**
   * @param req
   * @param res
   * @param next
   */

  //register dr or patient
  async register(req: Request, res: Response, next: NextFunction) {
    const { lang, role } = req.params;
    const { name, phone, password, city, address, clinic_name } = req.body;

    const hash_password = await hashPassword(password);

    let user: IDoctorRegister | IPatientRegister | {} = {};

    if (role === usersRoles.DOCTOR) {
      user = {
        name,
        phone,
        password: hash_password as string,
        city,
        address,
        clinic_name,
        role: role as usersRoles.DOCTOR,
      };
    } else if (role === usersRoles.PATIENT) {
      user = {
        name,
        phone,
        password: hash_password as string,
        city,
        address,
        role: role as usersRoles.PATIENT,
      };
    }

    try {
      const _user = new usersModel(user);
      await _user.save();
      response.signupSuccess(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  //login dr or patient
  async login(req: Request, res: Response, next: NextFunction) {
    const { role, lang } = req.params;
    const { phone, password } = req.body;

    try {
      const result = await usersModel
        .aggregate([])
        .match({ phone, role })
        .lookup({
          as: "city",
          localField: "city",
          from: "cities",
          foreignField: "_id",
        })
        .unwind("city")
        .project({
          _id: "$_id",
          name: "$name",
          phone: "$phone",
          image_url: "$image_url",
          role: "$role",
          city: lang === "ar" ? "$city.city_ar" : "$city.city_en",
          address: "$address",
          password: "$password",
        });

      if (!result[0]) response.phoneWrong(lang as LangTypes, res);
      else {
        const compare = await comparePassword(password, result[0].password);
        compare
          ? signJWT(result[0]._id, role, result[0].name, (error, token) => {
              response.loginSuccess(
                lang as LangTypes,
                res,
                result[0],
                token || ""
              );
            })
          : response.passwordWrong(lang as LangTypes, res);
      }
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  //verify dr or patient
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { user_id, role } = extractDataFromToken(req);

    const result = await usersModel
      .aggregate([])
      .match({ _id: new mongoose.Types.ObjectId(user_id) })
      .lookup({
        as: "city",
        localField: "city",
        from: "cities",
        foreignField: "_id",
      })
      .unwind("city")
      .project({
        _id: "$_id",
        name: "$name",
        phone: "$phone",
        role: "$role",
        image_url: "$image_url",
        city: lang === "ar" ? "$city.city_ar" : "$city.city_en",
        address: "$address",
      });

    try {
      !result[0]
        ? response.accountNotExist(lang as LangTypes, res)
        : signJWT(result[0]._id, role, result[0].name, (error, token) => {
            response.loginSuccess(
              lang as LangTypes,
              res,
              result[0],
              token || ""
            );
          });
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }
}
