import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { uploads } from "../middlewares/uploadImage";
import { UsersServices } from "../services/users.service";

export const usersRouter = Router({ mergeParams: true });

const usersServices = new UsersServices();

usersRouter.post(
  "/profile/image",
  checkAccessTokenValidation,
  uploads.single("image_url"),
  usersServices.updateImageProfile
);

usersRouter.put("/worktime/update", usersServices.updateWorkTimeProfile);

usersRouter.post("/verificationCode/send", usersServices.sendVerificationCode);

usersRouter.post(
  "/verificationCode/check",
  usersServices.checkVerificationCode
);

usersRouter.post("/password/reset", usersServices.resetPassword);
