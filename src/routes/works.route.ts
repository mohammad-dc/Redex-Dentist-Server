import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { uploads } from "../middlewares/uploadImage";
import { checkIfDoctor } from "../middlewares/usersMiddlewares";
import { WorksService } from "../services/works.service";

export const worksRouter = Router({ mergeParams: true });

const worksService = new WorksService();

worksRouter.post(
  "/add",
  checkAccessTokenValidation,
  checkIfDoctor,
  uploads.single("image_url"),
  worksService.uploadWorkImage
);

worksRouter.delete(
  "/remove/:image_id",
  checkAccessTokenValidation,
  checkIfDoctor,
  worksService.removeImageFromWorks
);

worksRouter.get("/:doctor_id", worksService.getAllImages);
