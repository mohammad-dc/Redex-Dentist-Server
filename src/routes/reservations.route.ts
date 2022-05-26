import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { ReservationsService } from "../services/reservations.service";

export const reservationsRouter = Router({ mergeParams: true });

const reservationsService = new ReservationsService();

//users
reservationsRouter.post(
  "/:role/add",
  checkAccessTokenValidation,
  reservationsService.addReservation
);

reservationsRouter.put(
  "/:role/update/:_id",
  checkAccessTokenValidation,
  reservationsService.updateReservation
);

reservationsRouter.post(
  "/cancel/:_id",
  checkAccessTokenValidation,
  reservationsService.cancelReservation
);

reservationsRouter.post(
  "/accept/:_id",
  checkAccessTokenValidation,
  reservationsService.acceptReservation
);

reservationsRouter.post(
  "/reject/:_id",
  checkAccessTokenValidation,
  reservationsService.rejectReservation
);

reservationsRouter.get(
  "/",
  checkAccessTokenValidation,
  reservationsService.getAllUserReservations
);

//admin
reservationsRouter.get(
  "/admin/count",
  reservationsService.getReservationsCount
);

reservationsRouter.get("/admin/all", reservationsService.getAllReservations);
