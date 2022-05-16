import { Request, Response, NextFunction } from "express";
import { comparePassword, hashPassword } from "../functions/bcryptPassword";
import { extractDataFromAdminToken, signAdminJWT } from "../functions/jwt";
import response from "../helpers/response";
import adminModel from "../models/admin.model";

export class AdminService {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const result = await adminModel.findOne(
        { email },
        { _id: 1, email: 1, password: 1 }
      );
      if (result) {
        const compare = await comparePassword(password, result.password);
        compare
          ? signAdminJWT(result._id, result.email, (error, token) => {
              response.loginSuccess("ar", res, result, token || "");
            })
          : response.passwordWrong("ar", res);
      } else {
        response.emailNotExist("ar", res);
      }
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }

  async addAdmin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const hash_password = await hashPassword(password);
      const _admin = new adminModel({ email, password: hash_password });
      await _admin.save();
      response.signupSuccess("ar", res);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { admin_id } = extractDataFromAdminToken(req);
      const result = await adminModel.findById(
        { _id: admin_id },
        { _id: 1, email: 1 }
      );
      result
        ? signAdminJWT(result._id, result.email, (error, token) => {
            response.loginSuccess("ar", res, result, token || "");
          })
        : response.accountNotExist("ar", res);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }
}
