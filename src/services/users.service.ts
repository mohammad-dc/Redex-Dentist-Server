import { Request, Response, NextFunction } from "express";
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
        response.sendVerificationCodeSuccess(lang, res);
      } else {
        response.accountNotExist(lang, res);
      }
    } catch (error) {
      response.somethingWentWrong(lang, res, error as Error);
    }
  }
}
