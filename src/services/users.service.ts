import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { LangTypes } from "../@types/app.type";
import { comparePassword, hashPassword } from "../functions/bcryptPassword";
import { sendSMS } from "../functions/twillio";
import response from "../helpers/response";
import usersModel from "../models/users.model";

export class UsersServices {
  async getUserProfile(req: Request, res: Response, next: NextFunction) {}

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {}

  async updateImageProfile(req: Request, res: Response, next: NextFunction) {}

  async searchDR(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { skip } = req.query;
    const { name, rate, city } = req.body;

    const ObjectId = mongoose.Types.ObjectId;

    try {
      const result = await usersModel
        .aggregate([])
        .match({
          role: "dr",
          city: city ? new ObjectId(city) : { $ne: null },
          name: name ? { $regex: name, $options: "i" } : { $ne: null },
        })
        .lookup({
          as: "review",
          localField: "reservation",
          from: "reviews",
          foreignField: "_id",
        })
        .unwind("review")
        .lookup({
          as: "reservation",
          localField: "$review.reservation",
          from: "reservations",
          foreignField: "_id",
        })
        .unwind("reservation")
        .lookup({
          as: "dr",
          localField: "$reservation.dr",
          from: "users",
          foreignField: "_id",
        })
        .unwind("dr")
        .group({
          _id: "$reservation.dr",
          count: { $sum: 1 },
          rate: { $sum: "$rate" },
        })
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
}
