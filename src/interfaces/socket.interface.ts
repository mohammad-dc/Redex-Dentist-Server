import { AddEditType } from "../@types/socket.type";
import { ICityResponse } from "./cities.interface";
import { IReportReasonsResponse } from "./reportsReasons.interface";

export interface ICitiesSocketParams {
  type: AddEditType;
  data: ICityResponse;
}

export interface IReportReasonsSocketParams {
  type: AddEditType;
  data: IReportReasonsResponse;
}
