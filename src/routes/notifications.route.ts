import { Router } from "express";
import notificationsController from "../controllers/notifications.controller";

export const notificationsRouter = Router();

notificationsRouter.get(
  "/get",
  notificationsController.getAllUserNotifications
);

notificationsRouter.get(
  "/missing",
  notificationsController.checkMissingNotifications
);

notificationsRouter.put(
  "/read",
  notificationsController.setNotificationsAsRead
);
