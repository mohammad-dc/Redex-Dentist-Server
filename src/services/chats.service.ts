import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import chatModel from "../models/chat.model";

export class ChatService {
  //users
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { receiver, message } = req.body;

    try {
      const { user_id } = extractDataFromToken(req);

      await new chatModel({ sender: user_id, receiver, message }).save();

      res.end();
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async getAllMessages(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { user, skip } = req.query;

    try {
      const { user_id } = extractDataFromToken(req);

      const results = await chatModel
        .find({
          $or: [
            { sender: user_id, receiver: user },
            { sender: user, receiver: user_id },
          ],
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(20);

      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }
}
