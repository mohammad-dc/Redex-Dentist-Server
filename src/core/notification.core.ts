import { ICreateNotification } from "../interfaces/notifications.interface";
import notificationsModel from "../models/notifications.model";

export const createNotification = async (content: ICreateNotification) => {
  const result = await new notificationsModel(content).save();
  return result;
};
