import { noticeTypes } from "../enums/notifications.enum";

export type notificationsTypes =
  | noticeTypes.ADD_REVIEW
  | noticeTypes.RESERVATION_APPROVED
  | noticeTypes.RESERVATION_CANCELED
  | noticeTypes.RESERVATION_DECLINED
  | noticeTypes.RESERVATION_ADDED;
