import { Router } from "express";
import { checkAdminAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { checkRequestValidation } from "../middlewares/requestValidation";
import { AdminService } from "../services/admin.service";
import { adminSchema } from "../validations/admin.validation";

export const adminRouter = Router({ mergeParams: true });
const adminService = new AdminService();

adminRouter.post(
  "/add",
  checkRequestValidation(adminSchema),
  adminService.addAdmin
);

adminRouter.post(
  "/login",
  checkRequestValidation(adminSchema),
  adminService.login
);

adminRouter.get(
  "/verify",
  checkAdminAccessTokenValidation,
  adminService.verify
);
