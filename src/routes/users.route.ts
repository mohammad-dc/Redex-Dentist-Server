import { Router } from "express";
import { UsersServices } from "../services/users.service";

export const usersRouter = Router({ mergeParams: true });

const usersServices = new UsersServices();

usersRouter.post("/verificationCode/send", usersServices.sendVerificationCode);
