import { Router } from "express";
import authController from "../controllers/auth.controller";
import { checkRequestValidation } from "../middlewares/requestValidation";
import { loginSchema, registerSchema } from "../validations/auth.validation";

export const authRouter = Router();

authRouter.post(
  "/:role/register",
  checkRequestValidation(registerSchema),
  authController.register
);

authRouter.post(
  "/:role/login",
  checkRequestValidation(loginSchema),
  authController.login
);

authRouter.get("/verify", authController.verifyAccount);
