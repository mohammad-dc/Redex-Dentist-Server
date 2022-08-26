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
    const { name, phone, password, city, address, email, clinic_name } =
      req.body;

    try {
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
          email,
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

      console.log({ user });

      const _user = new usersModel(user);
      await _user.save();
      response.signupSuccess(lang as LangTypes, res);
    } catch (error) {
      console.log(error);
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  //login patient
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
          work_time: 1,
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

  //verify patient
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;

    try {
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
          work_time: 1,
        });

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

  async loginDoctor(req: Request, res: Response, next: NextFunction) {
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
          work_time: 1,
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

  async verifyDoctorAccount(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;

    try {
      const current_date = new Date();
      const recent_date = new Date();
      recent_date.setDate(current_date.getDate() - 7);

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
        //* get today reservations
        .lookup({
          from: "reservations",
          as: "today_reservations",
          let: { doctor_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$doctor_id", "$doctor"] },
                    {
                      $eq: [
                        { $dayOfYear: "$createdAt" },
                        current_date.getDay(),
                      ],
                    },
                    {
                      $eq: [{ $month: "$createdAt" }, current_date.getMonth()],
                    },
                    {
                      $eq: [
                        { $year: "$createdAt" },
                        current_date.getFullYear(),
                      ],
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                as: "patient",
                let: { patient_id: "$patient" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$$patient_id", "$_id"] } },
                  },
                  {
                    $lookup: {
                      as: "city",
                      localField: "city",
                      from: "cities",
                      foreignField: "_id",
                    },
                  },
                  {
                    $unwind: {
                      path: "$city",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      image_url: 1,
                      address: 1,
                      city: lang === "ar" ? "$city.city_ar" : "$city.city_en",
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                date: 1,
                note: 1,
                status: 1,
                user: "$patient",
              },
            },
            { $limit: 20 },
          ],
        })
        //* get recent reservations
        .lookup({
          from: "reservations",
          as: "recent_reservations",
          let: { doctor_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$doctor_id", "$doctor"] },
                    { $lte: ["$date", current_date] },
                    { $gte: ["$date", recent_date] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                as: "patient",
                let: { patient_id: "$patient" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$$patient_id", "$_id"] } },
                  },
                  {
                    $lookup: {
                      as: "city",
                      localField: "city",
                      from: "cities",
                      foreignField: "_id",
                    },
                  },
                  {
                    $unwind: {
                      path: "$city",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      image_url: 1,
                      address: 1,
                      city: lang === "ar" ? "$city.city_ar" : "$city.city_en",
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                date: 1,
                note: 1,
                status: 1,
                user: "$patient",
              },
            },
            { $limit: 20 },
          ],
        })
        //* get past reservations
        .lookup({
          from: "reservations",
          as: "past_reservations",
          let: { doctor_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$doctor_id", "$doctor"] },
                    { $lte: ["$date", recent_date] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                as: "patient",
                let: { patient_id: "$patient" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$$patient_id", "$_id"] } },
                  },
                  {
                    $lookup: {
                      as: "city",
                      localField: "city",
                      from: "cities",
                      foreignField: "_id",
                    },
                  },
                  {
                    $unwind: {
                      path: "$city",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      image_url: 1,
                      address: 1,
                      city: lang === "ar" ? "$city.city_ar" : "$city.city_en",
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                date: 1,
                note: 1,
                status: 1,
                user: "$patient",
              },
            },
            { $limit: 20 },
          ],
        })
        //* works
        .lookup({
          as: "works",
          from: "works",
          let: { doctor_id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$doctor_id", "$doctor"] } } },
            {
              $project: {
                _id: 1,
                image_url: 1,
              },
            },
            { $limit: 20 },
          ],
        })
        //* chat list
        .lookup({
          as: "chat_list",
          from: "chats",
          let: { doctor_id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$doctor_id", "$doctor"] } } },
            {
              $lookup: {
                as: "patient",
                from: "users",
                let: { patient_id: "$patient" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$$patient_id", "$_id"] } } },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      image_url: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$patient",
                message_id: { $last: "$_id" },
                message: { $last: "$message" },
                sender: { $last: "$sender" },
                createdAt: { $last: "$createdAt" },
              },
            },
            {
              $project: {
                _id: 0,
                user: "$_id",
                message_id: 1,
                message: 1,
                sender: 1,
                createdAt: 1,
              },
            },
            { $sort: { message_id: -1 } },
            { $limit: 20 },
          ],
        })
        .project({
          _id: "$_id",
          name: "$name",
          phone: "$phone",
          role: "$role",
          email: "$email",
          clinic_name: "$clinic_name",
          bio: "$bio",
          image_url: "$image_url",
          city: lang === "ar" ? "$city.city_ar" : "$city.city_en",
          address: "$address",
          work_time: 1,
          works: 1,
          today_reservations: 1,
          recent_reservations: 1,
          past_reservations: 1,
          chat_list: 1,
        });

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
