import { Router } from "express";
import { NotificationsService } from "../services/notifications.service";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";

export const notificationsRouter = Router();
const notificationsService = new NotificationsService();

notificationsRouter.get(
  "/",
  checkAccessTokenValidation,
  notificationsService.getAllUserNotifications
);

notificationsRouter.get(
  "/missing",
  checkAccessTokenValidation,
  notificationsService.checkMissingNotifications
);

notificationsRouter.put(
  "/read",
  checkAccessTokenValidation,
  notificationsService.setNotificationsAsRead,
  notificationsService.checkMissingNotifications
);
