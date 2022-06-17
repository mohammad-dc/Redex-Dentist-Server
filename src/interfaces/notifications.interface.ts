import { notificationsTypes } from "../@types/notifications.type";

export interface ICreateNotification {
  sender: string;
  notice_type: notificationsTypes;
  receiver: string[];
}
