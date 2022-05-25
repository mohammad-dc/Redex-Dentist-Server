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
      const date = new Date();
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
          localField: "report_from",
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
          "reason._id": reason ? new ObjectId(reason as string) : { $ne: null },
          day: type === "recent" ? date.getDate() : { $ne: -1 },
          month: type === "recent" ? date.getMonth() + 1 : { $ne: -1 },
          year: type === "recent" ? date.getFullYear() : { $ne: -1 },
        })
        .project({
          _id: "$_id",
          reason: "$reason.reason_ar",
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
          day: "$day",
          month: "$month",
          year: "$year",
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(20);
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }
}
