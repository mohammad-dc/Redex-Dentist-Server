import { Twilio } from "twilio";
import config from "../config/config.config";

const client = new Twilio(
  config.twilio.account_sid as string,
  config.twilio.auth_token as string
);

export const sendSMS = async (body: string, to: string) => {
  try {
    await client.messages.create({
      body,
      to,
      messagingServiceSid: config.twilio.service_sid,
    });
  } catch (error) {
    console.error("Error SMS: ", error);
  }
};
