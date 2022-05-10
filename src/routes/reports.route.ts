import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { ReportService } from "../services/reports.service";

export const reportsRouter = Router({ mergeParams: true });

const reportService = new ReportService();

reportsRouter.post("/add", checkAccessTokenValidation, reportService.addReport);
