import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import {
  IReservationMatchFilter,
  ISaveReservation,
  IUpdateReservation,
} from "../interfaces/reservation.interface";
import reservationsModel from "../models/reservations.model";

export class ReservationsService {
  async addReservation(req: Request, res: Response, next: NextFunction) {
    const { lang, role } = req.params;
    const { date, user } = req.body;

    try {
      const { user_id } = extractDataFromToken(req);

      let reservation: ISaveReservation = {
        date,
        created_by: user_id,
      };

      if (role === "doctor") {
        reservation.patient = user;
        reservation.doctor = user_id;
        reservation.accepted = true;
      }

      if (role === "patient") {
        reservation.doctor = user;
        reservation.patient = user_id;
      }

      await new reservationsModel(reservation).save();

      response.addedSuccess(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async updateReservation(req: Request, res: Response, next: NextFunction) {
    const { lang, role, _id } = req.params;
    const { date, user } = req.body;

    try {
      const { user_id } = extractDataFromToken(req);

      let reservation: IUpdateReservation = {
        date,
      };

      if (role === "doctor") {
        reservation.patient = user;
        reservation.accepted = true;
      }

      if (role === "patient") {
        reservation.doctor = user;
        reservation.accepted = false;
      }

      const result = await reservationsModel.findOneAndUpdate(
        {
          _id,
          created_by: user_id,
        },
        reservation
      );

      result
        ? response.updatedSuccess(lang as LangTypes, res)
        : response.reservationNotAvailable(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async cancelReservation(req: Request, res: Response, next: NextFunction) {
    const { lang, _id } = req.params;

    try {
      const { user_id } = extractDataFromToken(req);

      const result = await reservationsModel.findOneAndUpdate(
        { _id, created_by: user_id },
        { status: "canceled" }
      );

      result
        ? response.reservationCanceled(lang as LangTypes, res)
        : response.reservationNotAvailable(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async acceptReservation(req: Request, res: Response, next: NextFunction) {
    const { lang, _id } = req.params;

    try {
      const { user_id } = extractDataFromToken(req);

      const result = await reservationsModel.findOneAndUpdate(
        { _id, created_by: user_id, doctor: user_id },
        { accepted: true }
      );

      result
        ? response.reservationAccepted(lang as LangTypes, res)
        : response.reservationNotAvailable(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async rejectReservation(req: Request, res: Response, next: NextFunction) {
    const { lang, _id } = req.params;

    try {
      const { user_id } = extractDataFromToken(req);

      const result = await reservationsModel.findOneAndUpdate(
        { _id, created_by: user_id, doctor: user_id },
        { accepted: false }
      );

      result
        ? response.reservationRejected(lang as LangTypes, res)
        : response.reservationNotAvailable(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async getAllReservations(req: Request, res: Response, next: NextFunction) {
    const { lang, role, type } = req.params;
    const { skip } = req.query;

    try {
      const { user_id } = extractDataFromToken(req);

      let filter: IReservationMatchFilter = {};

      if (role === "doctor") {
        filter.doctor = user_id;
      }
      if (role === "patient") {
        filter.patient = user_id;
      }

      if (type === "accepted") {
        filter.accepted = true;
      }
      if (type === "rejected") {
        filter.accepted = false;
      }

      const result = await reservationsModel
        .aggregate([])
        .match(filter)
        .lookup({
          as: "doctor",
          localField: "doctor",
          foreignField: "_id",
          from: "users",
        })
        .unwind("doctor")
        .lookup({
          as: "patient",
          localField: "patient",
          foreignField: "_id",
          from: "users",
        })
        .unwind("patient")
        .project({
          doctor: "$doctor",
          patient: "$patient",
          accepted: "$accepted",
          date: "$date",
          note: "$note",
          done: "$done",
        })
        .group({
          _id: "$date",
          reservations: {
            $push: {
              doctor: "$doctor",
              patient: "$patient",
              accepted: "$accepted",
              date: "$date",
              note: "$note",
              done: "$done",
            },
          },
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(5);

      response.getSuccess(res, result);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }
}
