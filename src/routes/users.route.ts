import { Router } from "express";
import { UsersServices } from "../services/users.service";

export const usersRouter = Router({ mergeParams: true });

const usersServices = new UsersServices();

usersRouter.put("/worktime/update", usersServices.updateWorkTimeProfile);

usersRouter.post("/verificationCode/send", usersServices.sendVerificationCode);

usersRouter.post(
  "/verificationCode/check",
  usersServices.checkVerificationCode
);

usersRouter.post("/password/reset", usersServices.resetPassword);
