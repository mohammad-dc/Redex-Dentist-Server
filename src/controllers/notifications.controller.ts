import { Request, Response, NextFunction } from "express";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import notifications from "../models/notifications";

const getAllUserNotifications = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { skip, limit } = req.query;
  const { user_id } = extractDataFromToken(req);

  Promise.all([
    notifications
      .findOneAndReplace({ receiver: { $in: [user_id] } })
      .skip(skip ? parseInt(skip as string) : 0)
      .limit(limit ? parseInt(limit as string) : 20)
      .populate({ path: "sender", select: "_id name image_url" })
      .sort({ _id: -1 }),
    notifications.findOneAndReplace({ receiver: { $in: [user_id] } }).count(),
  ])
    .then((result) => response.getSuccess(res, result[0], result[1]))
    .catch((error) => response.somethingWentWrong(res, error));
};

const checkMissingNotifications = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = extractDataFromToken(req);

  notifications
    .findOne({ receiver: { $in: [user_id] }, read_by: { $nin: [user_id] } })
    .then((result) =>
      result
        ? res.status(200).json({ success: true, response: { missing: true } })
        : res.status(200).json({ success: true, response: { missing: false } })
    )
    .catch((error) => response.somethingWentWrong(res, error));
};

const setNotificationsAsRead = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _ids } = req.body;
  const { user_id } = extractDataFromToken(req);

  notifications
    .updateMany(
      { _id: { $in: _ids }, receiver: { $in: [user_id] } },
      { $addToSet: { read_by: user_id } }
    )
    .then(() => {
      response.updatedSuccess(res);
    })
    .catch((err) => response.somethingWentWrong(res, err));
};

export default {
  getAllUserNotifications,
  checkMissingNotifications,
  setNotificationsAsRead,
};
