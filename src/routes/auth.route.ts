import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { checkRequestValidation } from "../middlewares/requestValidation";
import { AuthServices } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validations/auth.validation";

export const authRouter = Router({ mergeParams: true });
const authServices = new AuthServices();

authRouter.post(
  "/:role/register",
  checkRequestValidation(registerSchema),
  authServices.register
);

authRouter.post(
  "/:role/login",
  checkRequestValidation(loginSchema),
  authServices.login
);

authRouter.get(
  "/verify",
  checkAccessTokenValidation,
  authServices.verifyAccount
);
