import mongoose from "mongoose";
import config from "../../config/config.config";
import logger from "../logger";

export const connectToMongo = () => {
  mongoose.connect(config.mongo.url, config.mongo.options);
  const db = mongoose.connection;
  db.once("error", (error) => {
    logger.error(error);
  });
  db.on("open", () => {
    logger.info("Mongo Connected");
  });
};
