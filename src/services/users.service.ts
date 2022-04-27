import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import { comparePassword, hashPassword } from "../functions/bcryptPassword";
import { sendSMS } from "../functions/twillio";
import response from "../helpers/response";
import usersModel from "../models/users.model";

export class UsersServices {
  async getUserProfile(req: Request, res: Response, next: NextFunction) {}

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {}

  async updateImageProfile(req: Request, res: Response, next: NextFunction) {}

  async searchDR(req: Request, res: Response, next: NextFunction) {}

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
