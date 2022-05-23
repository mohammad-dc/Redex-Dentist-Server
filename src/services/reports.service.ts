import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { LangTypes } from "../@types/app.type";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import reportsModel from "../models/reports.model";

export class ReportService {
  //users
  async addReport(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { reason, content, report_to } = req.body;

    try {
      const { user_id } = extractDataFromToken(req);
      await new reportsModel({
        reason,
        content,
        report_from: user_id,
        report_to,
      }).save();
      response.addedSuccess(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  //admin
  async getAllReports(req: Request, res: Response, next: NextFunction) {
    const { type } = req.params;
    const { search, reason, skip } = req.query;

    try {
      const ObjectId = mongoose.Types.ObjectId;
      const results = await reportsModel
        .aggregate([])
        .lookup({
          as: "doctor",
          from: "users",
          localField: "report_to",
          foreignField: "_id",
        })
        .unwind("doctor")
        .lookup({
          as: "patient",
          from: "users",
          localField: "report_to",
          foreignField: "_id",
        })
        .unwind("patient")
        .lookup({
          as: "reason",
          from: "reportsreasons",
          localField: "reason",
          foreignField: "_id",
        })
        .unwind("reason")
        .project({
          _id: 1,
          doctor: 1,
          patient: 1,
          content: 1,
          reason: 1,
          createdAt: 1,
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          year: { $year: "$createdAt" },
        })
        .match({
          $or: [
            {
              "doctor.name": search
                ? { $regex: search, $options: "i" }
                : { $ne: null },
            },
            {
              "doctor.phone": search
                ? { $regex: search, $options: "i" }
                : { $ne: null },
            },
            {
              "patient.name": search
                ? { $regex: search, $options: "i" }
                : { $ne: null },
            },
            {
              "patient.phone": search
                ? { $regex: search, $options: "i" }
                : { $ne: null },
            },
          ],
          "reason._id": new ObjectId(reason as string),
          day: type === "recent" ? "$day" : { $ne: -1 },
          month: type === "recent" ? "$month" : { $ne: -1 },
          year: type === "recent" ? "$year" : { $ne: -1 },
        })
        .project({
          _id: "$_id",
          reason_ar: "$reason.reason_ar",
          reason_en: "$reason.reason_en",
          content: "$content",
          patient: {
            _id: "$patient._id",
            image_url: "$patient.image_url",
            name: "$patient.name",
          },
          doctor: {
            _id: "$doctor._id",
            image_url: "$doctor.image_url",
            name: "$doctor.name",
          },
          createdAt: 1,
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(20);
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }
}
