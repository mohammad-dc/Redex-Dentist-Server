import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import notifications from "../models/notifications.model";

export class NotificationsService {
  async getAllUserNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { lang } = req.params;
    const { skip, limit } = req.query;
    const { user_id } = extractDataFromToken(req);

    try {
      const result = await Promise.all([
        notifications
          .find({ receiver: { $in: [user_id] } })
          .skip(skip ? parseInt(skip as string) : 0)
          .limit(limit ? parseInt(limit as string) : 20)
          .populate({ path: "sender", select: "_id name image_url" })
          .sort({ _id: -1 }),
        notifications.count({ receiver: { $in: [user_id] } }),
      ]);
      response.getSuccess(res, result[0], result[1]);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async checkMissingNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { lang } = req.params;
    const { user_id } = extractDataFromToken(req);
    try {
      const result = await notifications
        .find({
          receiver: { $in: [user_id] },
          read_by: { $nin: [user_id] },
        })
        .count();

      response.retrieveSuccess(res, result);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async setNotificationsAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { lang } = req.params;
    const { _ids } = req.body;
    const { user_id } = extractDataFromToken(req);

    try {
      await notifications.updateMany(
        { _id: { $in: _ids }, receiver: { $in: [user_id] } },
        { $addToSet: { read_by: user_id } }
      );
      next();
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }
}
