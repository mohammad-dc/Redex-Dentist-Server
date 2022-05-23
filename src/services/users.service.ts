import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { LangTypes } from "../@types/app.type";
import { usersRoles } from "../enums/auth.enum";
import { comparePassword, hashPassword } from "../functions/bcryptPassword";
import { imageUploadProcess } from "../functions/imageUploadProcess";
import { extractDataFromToken } from "../functions/jwt";
import { sendSMS } from "../functions/twillio";
import response from "../helpers/response";
import usersModel from "../models/users.model";
import { deleteFileFromS3 } from "../utils/aws/s3";

export class UsersServices {
  //users
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    const { lang, role, _id } = req.params;

    try {
      const ObjectId = mongoose.Types.ObjectId;
      const result = await usersModel
        .aggregate([])
        .match({ _id: new ObjectId(_id), role })
        .lookup({
          as: "city",
          from: "cities",
          localField: "city",
          foreignField: "_id",
        })
        .unwind("city")
        .lookup({
          as: "works",
          from: "works",
          localField: "_id",
          foreignField: "doctor",
        })
        .lookup({
          as: "reviews",
          from: "reviews",
          localField: "_id",
          foreignField: "doctor",
        })
        .project({
          _id: 0,
          user: {
            _id: "$_id",
            name: "$name",
            phone: "$phone",
            clinic_name: "$clinic_name",
            bio: "$bio",
            role: "$role",
            city: lang === "en" ? "$city.city_en" : "$city.city_ar",
            address: "$address",
            image_url: "$image_url",
          },
          works: "$works",
          reviews: "$reviews",
        });
      response.retrieveSuccess(res, result[0]);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    const { lang, role } = req.params;
    const { name, phone, bio, city, address, clinic_name } = req.body;

    try {
      const { user_id } = extractDataFromToken(req);
      let user: any = {};

      if (role === usersRoles.DOCTOR) {
        user = {
          name,
          phone,
          bio,
          city,
          address,
          clinic_name,
        };
      } else if (role === usersRoles.PATIENT) {
        user = {
          name,
          phone,
          city,
          address,
        };
      }
      const result = await usersModel.findByIdAndUpdate({ _id: user_id }, user);
      result
        ? response.updatedSuccess(lang as LangTypes, res)
        : response.accountNotExist(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async updateImageProfile(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;

    try {
      const { user_id } = extractDataFromToken(req);
      const file = req.file as any;

      const image_url = await imageUploadProcess(file);

      const result = await usersModel.findByIdAndUpdate(
        { _id: user_id },
        { image_url }
      );

      if (result) {
        result.image_url &&
          (await deleteFileFromS3(
            result.image_url.substring(result.image_url.lastIndexOf("/") + 1)
          ));
        response.updatedSuccess(lang as LangTypes, res);
      } else {
        response.accountNotExist(lang as LangTypes, res);
      }
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async updateWorkTimeProfile(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { saturday, sunday, monday, tuesday, wednesday, thursday, friday } =
      req.body;

    const { user_id } = extractDataFromToken(req);

    try {
      const result = await usersModel.findByIdAndUpdate(
        { _id: user_id },
        { saturday, sunday, monday, tuesday, wednesday, thursday, friday }
      );
      result
        ? response.updatedSuccess(lang as LangTypes, res)
        : response.accountNotExist(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async searchDoctors(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { skip } = req.query;
    const { name, rate, city } = req.body;

    const ObjectId = mongoose.Types.ObjectId;

    try {
      const result = await usersModel
        .aggregate([])
        .match({
          role: "doctor",
          city: city ? new ObjectId(city) : { $ne: null },
          name: name ? { $regex: name, $options: "i" } : { $ne: null },
        })
        .lookup({
          as: "city",
          from: "cities",
          localField: "city",
          foreignField: "_id",
        })
        .unwind("city")
        .lookup({
          as: "reviews",
          from: "reviews",
          localField: "_id",
          foreignField: "doctor",
        })
        .project({
          _id: 0,
          user: {
            _id: "$_id",
            name: "$name",
            phone: "$phone",
            clinic_name: "$clinic_name",
            bio: "$bio",
            role: "$role",
            city: lang === "en" ? "$city.city_en" : "$city.city_ar",
            address: "$address",
            image_url: "$image_url",
          },
          reviews: "$reviews",
          reviews_count: { $size: "$reviews" },
        })
        .group({
          _id: "$user",
          rate_sum: { $sum: "$reviews.rate" },
          rate: { $avg: "$reviews.rate" },
        })
        .match({ rate: rate ? (rate === 0 ? null : rate) : { $ne: "" } })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(20);

      response.getSuccess(res, result);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async sendVerificationCode(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { phone } = req.body;

    try {
      const verification_code = Math.floor(Math.random() * 90000) + 10000;
      const result = await usersModel.findOneAndUpdate(
        { phone },
        { verification_code }
      );
      if (result) {
        sendSMS(
          lang === "ar"
            ? `رمز التفعيل لاعادة تعين كلمة المرور ${verification_code}`
            : `verification code to reset password ${verification_code}`,
          phone
        );
        response.sendVerificationCodeSuccess(lang as LangTypes, res);
      } else {
        response.accountNotExist(lang as LangTypes, res);
      }
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async checkVerificationCode(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { phone, verification_code } = req.body;

    try {
      const result = await usersModel.findOneAndUpdate(
        { phone, verification_code },
        { $unset: { verification_code: "" } }
      );
      result
        ? response.verificationCodeWrong(lang as LangTypes, res)
        : response.operationSuccess(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;

    const { phone, old_password, new_password } = req.body;

    try {
      const user = await usersModel.findOne({ phone });
      const compare = await comparePassword(old_password, user.password);
      if (compare) {
        const password = await hashPassword(new_password);
        await usersModel.findOneAndUpdate({ phone }, { password });
        response.updatedSuccess(lang as LangTypes, res);
      } else {
        response.oldPasswordWrong(lang as LangTypes, res);
      }
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  //admin
  async getAllPatients(req: Request, res: Response, next: NextFunction) {
    const { search, skip } = req.query;

    try {
      const current_date = new Date();
      const results = await usersModel
        .aggregate([])
        .match({
          role: usersRoles.PATIENT,
          $or: [
            {
              name: search ? { $regex: search, $options: "i" } : { $ne: null },
            },
            {
              phone: search ? { $regex: search, $options: "i" } : { $ne: null },
            },
          ],
        })
        .lookup({
          as: "city",
          from: "cities",
          localField: "city",
          foreignField: "_id",
        })
        .unwind("city")
        .lookup({
          as: "reservations",
          from: "reservations",
          localField: "_id",
          foreignField: "patient",
        })
        .project({
          _id: "_$id",
          image_url: "$image_url",
          name: "$name",
          phone: "$phone",
          city: "$city.city_ar",
          address: "$address",
          total_reservations: { $size: "$reservations" },
          reservations_month: {
            $filter: {
              input: "$reservations",
              as: "res",
              cond: {
                $and: [
                  { month: current_date.getMonth() },
                  { year: current_date.getFullYear() },
                ],
              },
            },
          },
        })
        .project({
          _id: "_$id",
          image_url: "$image_url",
          name: "$name",
          phone: "$phone",
          city: "$city",
          address: "$address",
          total_reservations_count: "$total_reservations",
          reservations_month_count: { $size: "$reservations_month" },
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(20);
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }

  async getAllDoctors(req: Request, res: Response, next: NextFunction) {
    const { search, skip } = req.query;

    try {
      const current_date = new Date();
      const results = await usersModel
        .aggregate([])
        .match({
          role: usersRoles.DOCTOR,
          $or: [
            {
              name: search ? { $regex: search, $options: "i" } : { $ne: null },
            },
            {
              phone: search ? { $regex: search, $options: "i" } : { $ne: null },
            },
          ],
        })
        .lookup({
          as: "city",
          from: "cities",
          localField: "city",
          foreignField: "_id",
        })
        .unwind("city")
        .lookup({
          as: "reservations",
          from: "reservations",
          localField: "_id",
          foreignField: usersRoles.DOCTOR,
        })
        .lookup({
          as: "reviews",
          from: "reviews",
          localField: "_id",
          foreignField: usersRoles.DOCTOR,
        })
        .lookup({
          as: "reports",
          from: "reports",
          localField: "_id",
          foreignField: "report_to",
        })
        .project({
          _id: "$_id",
          email: "$email",
          clinic_name: "$clinic_name",
          image_url: "$image_url",
          name: "$name",
          phone: "$phone",
          city: "$city.city_ar",
          address: "$address",
          reports: { $size: "$reports" },
          total_reservations: { $size: "$reservations" },
          reservations_month: {
            $filter: {
              input: "$reservations",
              as: "res",
              cond: {
                $and: [
                  { month: current_date.getMonth() },
                  { year: current_date.getFullYear() },
                ],
              },
            },
          },
        })
        .project({
          _id: "$_id",
          email: "$email",
          clinic_name: "$clinic_name",
          image_url: "$image_url",
          name: "$name",
          phone: "$phone",
          city: "$city.city_ar",
          address: "$address",
          reports: "$reports",
          total_reservations_count: "$total_reservations",
          reservations_month_count: { $size: "$reservations_month" },
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(20);
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }
  async adminGetCountOfUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await usersModel.aggregate([]).group({
        _id: "$role",
        count: { $sum: 1 },
      });
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }

  async joiningStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await usersModel
        .aggregate([])
        .project({
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        })
        .match({
          year: new Date().getFullYear(),
        })
        .group({ _id: "$month", count: { $sum: 1 } });
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }

  async usersCitiesStatistics(req: Request, res: Response, next: NextFunction) {
    const { role } = req.params;

    try {
      const results = await usersModel
        .aggregate([])
        .match({ role })
        .lookup({
          as: "city",
          from: "cities",
          foreignField: "_id",
          localField: "city",
        })
        .unwind("city")
        .project({
          city: "$city.city_ar",
        })
        .group({
          _id: "$city",
          count: { $sum: 1 },
        });
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }
}
