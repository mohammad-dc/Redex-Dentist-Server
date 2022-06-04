import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { LangTypes } from "../@types/app.type";
import { usersRoles } from "../enums/auth.enum";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import chatModel from "../models/chat.model";

export class ChatService {
  //users
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { user, message } = req.body;

    try {
      const { user_id, role } = extractDataFromToken(req);

      let data: any = { sender: role, message };

      if (role === usersRoles.DOCTOR) {
        data.doctor = user_id;
        data.patient = user;
      }

      if (role === usersRoles.PATIENT) {
        data.doctor = user;
        data.patient = user_id;
      }

      await new chatModel(data).save();

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

  async getChatList(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { skip } = req.query;

    try {
      const { user_id, role } = extractDataFromToken(req);
      const ObjectId = mongoose.Types.ObjectId;

      let search: any = {};
      let group: any = {};

      if (role === usersRoles.DOCTOR) {
        search.doctor = new ObjectId(user_id);
        group.user = "$patient";
      }
      if (role === usersRoles.PATIENT) {
        search.patient = new ObjectId(user_id);
        group.user = "$doctor";
      }

      const results = await chatModel
        .aggregate([])
        .match(search)
        .lookup({
          as: "doctor",
          from: "users",
          localField: "doctor",
          foreignField: "_id",
        })
        .unwind("doctor")
        .lookup({
          as: "patient",
          from: "users",
          localField: "patient",
          foreignField: "_id",
        })
        .unwind("patient")
        .project({
          doctor: {
            _id: "$doctor._id",
            image_url: "$doctor.image_url",
            name: "$doctor.name",
          },
          patient: {
            _id: "$patient._id",
            image_url: "$patient.image_url",
            name: "$patient.name",
          },
          sender: 1,
          message: 1,
          createdAt: 1,
        })
        .group({
          _id: group,
          message: { $last: "$message" },
          sender: { $last: "$sender" },
          createdAt: { $last: "$createdAt" },
        })
        .project({
          _id: 0,
          user: "$_id.user",
          message: "$message",
          createdAt: "$createdAt",
          sender: "$sender",
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(10);

      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }
}
