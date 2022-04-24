import { Router } from "express";
import notificationsController from "../controllers/notifications.controller";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";

export const notificationsRouter = Router();

notificationsRouter.get(
  "/get",
  checkAccessTokenValidation,
  notificationsController.getAllUserNotifications
);

notificationsRouter.get(
  "/missing",
  checkAccessTokenValidation,
  notificationsController.checkMissingNotifications
);

notificationsRouter.put(
  "/read",
  checkAccessTokenValidation,
  notificationsController.setNotificationsAsRead
);
