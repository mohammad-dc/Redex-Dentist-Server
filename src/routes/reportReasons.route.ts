import { Router } from "express";
import { ReportReasonsService } from "../services/reportReasons.service";

export const reportReasonsRouter = Router({ mergeParams: true });

const reportReasonsService = new ReportReasonsService();

reportReasonsRouter.post("/add", reportReasonsService.addReason);

reportReasonsRouter.put("/update/:_id", reportReasonsService.updateReason);

reportReasonsRouter.get("/", reportReasonsService.getAllReasons);
