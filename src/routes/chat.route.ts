import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { checkRequestValidation } from "../middlewares/requestValidation";
import { ChatService } from "../services/chats.service";
import { chatSchema } from "../validations/chat.validation";

export const chatRouter = Router({ mergeParams: true });

const chatService = new ChatService();

chatRouter.post(
  "/send",
  checkAccessTokenValidation,
  checkRequestValidation(chatSchema),
  chatService.sendMessage
);

chatRouter.get("/", checkAccessTokenValidation, chatService.getAllMessages);
