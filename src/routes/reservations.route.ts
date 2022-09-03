import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { checkIfDoctor } from "../middlewares/usersMiddlewares";
import { ReservationsService } from "../services/reservations.service";

export const reservationsRouter = Router({ mergeParams: true });

const reservationsService = new ReservationsService();

//users
reservationsRouter.post(
  "/add",
  checkAccessTokenValidation,
  reservationsService.addReservation
);

reservationsRouter.post(
  "/note/add/:_id",
  checkAccessTokenValidation,
  checkIfDoctor,
  reservationsService.addNoteToReservation
);

reservationsRouter.put(
  "/update/:_id",
  checkAccessTokenValidation,
  reservationsService.updateReservation
);

reservationsRouter.post(
  "/cancel/:_id",
  checkAccessTokenValidation,
  reservationsService.cancelReservation
);

reservationsRouter.post(
  "/approve/:_id",
  checkAccessTokenValidation,
  reservationsService.approveReservation
);

reservationsRouter.post(
  "/decline/:_id",
  checkAccessTokenValidation,
  reservationsService.declineReservation
);

reservationsRouter.post(
  "/",
  checkAccessTokenValidation,
  reservationsService.getAllUserReservations
);

reservationsRouter.get(
  "/:reservation_id",
  checkAccessTokenValidation,
  reservationsService.getReservation
);

//admin
reservationsRouter.get(
  "/admin/count",
  reservationsService.getReservationsCount
);

reservationsRouter.get("/admin/all", reservationsService.getAllReservations);
