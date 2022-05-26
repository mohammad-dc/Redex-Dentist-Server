import Pusher from "pusher";
import config from "../../config/config.config";
import { SocketAdminEvents, SocketClientEvents } from "../../enums/socket.enum";

export const pusher = new Pusher({
  appId: config.pusher.app_id as string,
  key: config.pusher.key as string,
  secret: config.pusher.secret as string,
  cluster: config.pusher.cluster as string,
  useTLS: true,
});

export const socket_events = {
  admin: SocketAdminEvents,
  client: SocketClientEvents,
};
