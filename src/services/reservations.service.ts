import { Request, Response, NextFunction } from "express";

export class ReservationsService {
  async addReservation(req: Request, res: Response, next: NextFunction) {}

  async updateReservation(req: Request, res: Response, next: NextFunction) {}

  async cancelReservation(req: Request, res: Response, next: NextFunction) {}

  async acceptReservation(req: Request, res: Response, next: NextFunction) {}

  async getAllPatientReservations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}

  async getAllDoctorReservations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}

  async getReservation(req: Request, res: Response, next: NextFunction) {}
}
