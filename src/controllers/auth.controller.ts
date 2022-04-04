import { Request, Response, NextFunction } from "express";
import { comparePassword, hashPassword } from "../functions/bcryptPassword";
import { extractDataFromToken, signJWT } from "../functions/jwt";
import response from "../helpers/response";
import body from "../helpers/response/body";
import usersModel from "../models/users.model";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.params;
  const { name, phone, password, city, address, clinic_name } = req.body;

  const hash_password = await hashPassword(password);

  const user = {
    name,
    phone,
    password: hash_password,
    city,
    address,
    clinic_name,
    role,
  };

  const _user = new usersModel(user);

  _user
    .save()
    .then(() => response.signupSuccess(res))
    .catch((error: Error) => response.somethingWentWrong(res, error));
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.params;
  const { phone, password } = req.body;

  usersModel.findOne({ phone, role }, body.ACCOUNT).then(async (result) => {
    if (!result) response.phoneWrong(res);
    else {
      const compare = await comparePassword(password, result.password);
      compare
        ? signJWT(result._id, role, result.name, (error, token) => {
            response.loginSuccess(res, result, token || "");
          })
        : response.passwordWrong(res);
    }
  });
};

const verifyAccount = (req: Request, res: Response, next: NextFunction) => {
  const { user_id, role } = extractDataFromToken(req);

  usersModel.findById({ _id: user_id }, body.ACCOUNT).then((result) => {
    !result
      ? response.accountNotExist(res)
      : signJWT(result._id, role, result.name, (error, token) => {
          response.loginSuccess(res, result, token || "");
        });
  });
};

export default { register, login, verifyAccount };
