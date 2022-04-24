import { Request, Response, NextFunction } from "express";
import { usersRoles } from "../enums/auth.enum";
import { comparePassword, hashPassword } from "../functions/bcryptPassword";
import { extractDataFromToken, signJWT } from "../functions/jwt";
import response from "../helpers/response";
import body from "../helpers/response/body";
import { IDrRegister, IPatientRegister } from "../interfaces/auth.interface";
import usersModel from "../models/users.model";

export class AuthServices {
  /**
   * @param req
   * @param res
   * @param next
   */

  //register dr or patient
  async register(req: Request, res: Response, next: NextFunction) {
    const { role } = req.params;
    const { name, phone, password, city, address, clinic_name } = req.body;

    const hash_password = await hashPassword(password);

    let user: IDrRegister | IPatientRegister | {} = {};

    if (role === usersRoles.DR) {
      user = {
        name,
        phone,
        password: hash_password as string,
        city,
        address,
        clinic_name,
        role: role as usersRoles.DR,
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
      response.signupSuccess(res);
    } catch (error) {
      response.somethingWentWrong(res, error as Error);
    }
  }

  //login dr or patient
  async login(req: Request, res: Response, next: NextFunction) {
    const { role } = req.params;
    const { phone, password } = req.body;

    try {
      const result = await usersModel
        .findOne({ phone, role }, body.ACCOUNT)
        .populate({ path: "city", select: "_id city" });

      if (!result) response.phoneWrong(res);
      else {
        const compare = await comparePassword(password, result.password);
        compare
          ? signJWT(result._id, role, result.name, (error, token) => {
              response.loginSuccess(res, result, token || "");
            })
          : response.passwordWrong(res);
      }
    } catch (error) {
      response.somethingWentWrong(res, error as Error);
    }
  }

  //verify dr or patient
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    const { user_id, role } = extractDataFromToken(req);

    const result = await usersModel
      .findById({ _id: user_id }, body.ACCOUNT)
      .populate({ path: "city", select: "_id city" });

    try {
      !result
        ? response.accountNotExist(res)
        : signJWT(result._id, role, result.name, (error, token) => {
            response.loginSuccess(res, result, token || "");
          });
    } catch (error) {
      response.somethingWentWrong(res, error as Error);
    }
  }
}
