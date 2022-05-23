import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { checkRequestValidation } from "../middlewares/requestValidation";
import { uploads } from "../middlewares/uploadImage";
import { UsersServices } from "../services/users.service";
import {
  searchDoctorsSchema,
  sendVerificationCodeSchema,
  updateProfileSchema,
} from "../validations/user.validation";

export const usersRouter = Router({ mergeParams: true });

const usersServices = new UsersServices();

//users
usersRouter.get(
  "/:role/profile/:_id",
  // checkAccessTokenValidation,
  usersServices.getUserProfile
);

usersRouter.put(
  "/:role/profile/update",
  checkAccessTokenValidation,
  checkRequestValidation(updateProfileSchema),
  usersServices.updateUserProfile
);

usersRouter.post(
  "/profile/image/update",
  checkAccessTokenValidation,
  uploads.single("image_url"),
  usersServices.updateImageProfile
);

usersRouter.put(
  "/worktime/update",
  checkAccessTokenValidation,
  usersServices.updateWorkTimeProfile
);

usersRouter.post(
  "/search",
  // checkAccessTokenValidation,
  checkRequestValidation(searchDoctorsSchema),
  usersServices.searchDoctors
);

usersRouter.post(
  "/verificationCode/send",
  checkRequestValidation(sendVerificationCodeSchema),
  usersServices.sendVerificationCode
);

usersRouter.post(
  "/verificationCode/check",
  usersServices.checkVerificationCode
);

usersRouter.post("/password/reset", usersServices.resetPassword);

//admin
usersRouter.get("/admin/patients", usersServices.getAllPatients);

usersRouter.get("/admin/doctors", usersServices.getAllDoctors);

usersRouter.get("/admin/count", usersServices.adminGetCountOfUsers);

usersRouter.get("/admin/statistics/joining", usersServices.joiningStatistics);

usersRouter.get(
  "/admin/statistics/:role/cities",
  usersServices.usersCitiesStatistics
);
