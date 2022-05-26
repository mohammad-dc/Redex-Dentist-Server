import { pusher, socket_events } from ".";
import {
  ICitiesSocketParams,
  IReportReasonsSocketParams,
} from "../../interfaces/socket.interface";

const citiesSocket = (args: ICitiesSocketParams) => {
  pusher.trigger(
    "admin-cities",
    args.type === "add"
      ? socket_events.admin.ADD_CITY
      : socket_events.admin.EDIT_CITY,
    JSON.stringify({ data: args.data })
  );
};

const reportReasonsSocket = (args: IReportReasonsSocketParams) => {
  pusher.trigger(
    "admin-cities",
    args.type === "add"
      ? socket_events.admin.ADD_REPORT_REASON
      : socket_events.admin.EDIT_REPORT_REASON,
    JSON.stringify({ data: args.data })
  );
};

export default { citiesSocket, reportReasonsSocket };
