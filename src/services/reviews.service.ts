import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { LangTypes } from "../@types/app.type";
import { createNotification } from "../core/notification.core";
import { noticeTypes } from "../enums/notifications.enum";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import reviewsModel from "../models/reviews.model";

export class ReviewsService {
  async addReview(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { rate, doctor, note } = req.body;

    try {
      const { user_id } = extractDataFromToken(req);

      //save review
      await new reviewsModel({ rate, doctor, note, patient: user_id }).save();
      //send notification add review
      await createNotification({
        sender: user_id,
        notice_type: noticeTypes.ADD_REVIEW,
        receiver: [doctor],
      });
      //send response to client
      response.addedSuccess(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async getAllReview(req: Request, res: Response, next: NextFunction) {
    const { lang, doctor_id } = req.params;
    const { skip } = req.query;

    try {
      const ObjectId = mongoose.Types.ObjectId;
      const results = await reviewsModel
        .aggregate([])
        .match({
          doctor: new ObjectId(doctor_id),
          note: { $ne: null },
        })
        .lookup({
          as: "patient",
          from: "users",
          localField: "patient",
          foreignField: "_id",
        })
        .unwind("patient")
        .project({
          _id: 1,
          patient: {
            _id: "$patient._id",
            image_url: "$patient.image_url",
            name: "$patient.name",
          },
          rate: 1,
          note: 1,
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(20);
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }
}
